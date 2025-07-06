/**
 * Cloudflare Function for handling email subscriptions
 * Integrates with Mailchimp API to add/update subscribers
 */

type MemberData = {
  email_address: string;
  merge_fields: {
    FNAME: string;
    LNAME: string;
    COUNTRY: string;
  };
  status: 'subscribed' | 'pending';
};

type SubscriptionRequest = {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
};

// Helper function to get environment variables
function getFromEnv(property: string, env: Env) {
  const value = env[property as keyof Env];
  if (!value) {
    throw new Error(`Missing ${property} in environment variables`);
  }
  return value;
}

// Helper function to create MD5 hash
async function toMd5(value: string) {
  const data = new TextEncoder().encode(value.toLowerCase());
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

// Check if a member already exists in Mailchimp
async function doesMemberExist(
  apiKey: string,
  serverPrefix: string,
  listId: string,
  email: string,
) {
  const hashedEmail = await toMd5(email);
  const mailchimpUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members/${hashedEmail}`;

  const response = await fetch(mailchimpUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  return response.ok;
}

// Add a new member to Mailchimp
async function addMemberToMailchimp(
  apiKey: string,
  serverPrefix: string,
  audienceId: string,
  memberData: MemberData,
) {
  const mailchimpUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

  return fetch(mailchimpUrl, {
    method: 'POST',
    body: JSON.stringify(memberData),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
}

// Update an existing member in Mailchimp
async function updateMemberInMailchimp(
  apiKey: string,
  serverPrefix: string,
  audienceId: string,
  memberData: MemberData,
) {
  const email = memberData.email_address;
  const mailchimpUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${await toMd5(email)}`;

  return fetch(mailchimpUrl, {
    method: 'PATCH',
    body: JSON.stringify(memberData),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
}

// Main function handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    try {
      // Parse the request body
      const {
        email: emailRaw,
        firstName,
        lastName,
        country,
      } = (await request.json()) as SubscriptionRequest;
      const email = emailRaw.toLowerCase();

      // Validate required fields
      if (!email) {
        return new Response(
          JSON.stringify({
            error: 'Email is required',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          },
        );
      }

      // Get Mailchimp configuration from environment variables
      const apiKey = getFromEnv('MAILCHIMP_API_KEY', env);
      const serverPrefix = getFromEnv('MAILCHIMP_SERVER_PREFIX', env);
      const audienceId = getFromEnv('MAILCHIMP_AUDIENCE_ID', env);

      // Create member data for Mailchimp
      const memberData = {
        email_address: email,
        merge_fields: {
          FNAME: firstName || '',
          LNAME: lastName || '',
          COUNTRY: country || '',
        },
      };

      // Check if member already exists
      const memberExists = await doesMemberExist(
        apiKey,
        serverPrefix,
        audienceId,
        email,
      );

      if (memberExists) {
        // Update existing member
        const updateResponse = await updateMemberInMailchimp(
          apiKey,
          serverPrefix,
          audienceId,
          { ...memberData, status: 'subscribed' },
        );

        if (updateResponse.ok) {
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Subscription updated successfully',
              isUpdate: true,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            },
          );
        } else {
          console.error(
            `Failed to update member ${email}: ${await updateResponse.text()}`,
          );
          return new Response(
            JSON.stringify({
              error: 'Failed to update subscription',
            }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            },
          );
        }
      } else {
        // Add new member
        const response = await addMemberToMailchimp(
          apiKey,
          serverPrefix,
          audienceId,
          { ...memberData, status: 'pending' },
        );

        if (response.ok) {
          console.log(`Added member ${email}`);
          return new Response(
            JSON.stringify({
              success: true,
              message:
                'Subscription added successfully. Please check your email to confirm.',
              isUpdate: false,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            },
          );
        } else {
          console.error(
            `Failed to add member ${email}: ${await response.text()}`,
          );
          return new Response(
            JSON.stringify({
              error: 'Failed to add subscription',
            }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            },
          );
        }
      }
    } catch (error) {
      console.error('Subscription function error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    }
  },
} satisfies ExportedHandler<Env>;
