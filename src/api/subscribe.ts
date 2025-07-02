import type { Request, Response, RequestHandler } from 'express';

export const handleSubscribe: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { email, firstName, lastName, country } = req.body;

  // Validate required fields
  if (!email) {
    res.status(400).json({
      error: 'Email is required',
    });
    return;
  }

  // Mailchimp API configuration
  const apiKey = process.env['MAILCHIMP_API_KEY'];
  if (!apiKey) {
    console.error('MAILCHIMP_API_KEY environment variable is not set');
    res.status(500).json({
      error: 'Server configuration error',
    });
    return;
  }

  const serverPrefix = 'us10';
  const audienceId = '935d1c5649';
  const baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`;

  // Prepare member data for Mailchimp
  const member = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: firstName || '',
      LNAME: lastName || '',
      COUNTRY: country || '',
    },
  };

  // Make request to Mailchimp API
  const auth = Buffer.from(`anystring:${apiKey}`).toString('base64');
  const response = await fetch(`${baseUrl}/lists/${audienceId}/members`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(member),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Mailchimp API error: ${JSON.stringify(responseData)}`);
  }

  res.json({ success: true });
};
