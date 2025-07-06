import { Request, Response } from 'express';

interface SubscribeRequest {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
}

interface MailchimpMember {
  email_address: string;
  status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending';
  merge_fields: {
    FNAME?: string;
    LNAME?: string;
    COUNTRY?: string;
  };
  tags?: string[];
}

interface MailchimpResponse {
  id: string;
  email_address: string;
  status: string;
  merge_fields: {
    FNAME: string;
    LNAME: string;
    COUNTRY: string;
  };
}

function getFromEnv(property: string) {
  const value = process.env[property];
  if (!value) {
    throw new Error(`Missing ${property} in environment variables`);
  }
  return value;
}

async function addMemberToMailchimp(
  apiKey: string,
  serverPrefix: string,
  audienceId: string,
  memberData: MailchimpMember,
) {
  const mailchimpUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
  console.log(mailchimpUrl);
  return fetch(mailchimpUrl, {
    method: 'POST',
    body: JSON.stringify(memberData),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
}

function toMd5(value: string) {
  const md5 = require('crypto').createHash('md5');
  return md5.update(value.toLowerCase()).digest('hex');
}

async function doesMemberExist(
  apiKey: string,
  serverPrefix: string,
  listId: string,
  email: string,
) {
  const hashedEmail = toMd5(email);
  const mailchimpUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members/${hashedEmail}`;
  const response = await fetch(mailchimpUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  return response.ok;
}

async function updateMemberInMailchimp(
  apiKey: string,
  serverPrefix: string,
  audienceId: string,
  memberData: MailchimpMember,
) {
  const email = memberData.email_address;
  const mailchimpUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${toMd5(email)}`;
  console.log(mailchimpUrl);
  return fetch(mailchimpUrl, {
    method: 'PATCH',
    body: JSON.stringify(memberData),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function handleSubscribe(
  req: Request,
  res: Response,
): Promise<void> {
  const {
    email: emailRaw,
    firstName,
    lastName,
    country,
  }: SubscribeRequest = req.body;
  const email = emailRaw.toLowerCase();

  // Get Mailchimp configuration from environment variables
  const apiKey = getFromEnv('MAILCHIMP_API_KEY');
  const serverPrefix = getFromEnv('MAILCHIMP_SERVER_PREFIX');
  const audienceId = getFromEnv('MAILCHIMP_AUDIENCE_ID');

  // Create member data for Mailchimp
  const memberData = {
    email_address: email,
    merge_fields: {
      FNAME: firstName || '',
      LNAME: lastName || '',
      COUNTRY: country || '',
    },
  };

  const memberExists = await doesMemberExist(
    apiKey,
    serverPrefix,
    audienceId,
    email,
  );

  if (memberExists) {
    const updateResponse = await updateMemberInMailchimp(
      apiKey,
      serverPrefix,
      audienceId,
      { ...memberData, status: 'subscribed' },
    );

    if (updateResponse.ok) {
      res
        .status(200)
        .json({
          mode: 'updated',
        })
        .send();
      console.log(`updated member ${email}`);
      return;
    } else {
      console.log(
        `failed to update member ${email}: ${await updateResponse.text()}`,
      );
      res.status(500).send();
      return;
    }
  } else {
    const response = await addMemberToMailchimp(
      apiKey,
      serverPrefix,
      audienceId,
      { ...memberData, status: 'pending' },
    );

    if (response.ok) {
      res
        .status(200)
        .json({
          mode: 'added',
        })
        .send();
      console.log(`added member ${email}`);
      return;
    } else {
      console.log(`failed to add member ${email}: ${await response.text()}`);
      res.status(500).send();
      return;
    }
  }
}
