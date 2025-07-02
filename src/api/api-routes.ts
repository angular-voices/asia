import { CreateEmailResponse, Resend } from 'resend';
import { Request, Response } from 'express';

export function setupApiRoutes(app: any) {
  // Defer Resend instantiation to avoid issues if API key is missing
  const getResend = () => {
    const apiKey = process.env['RESEND_API_KEY'];
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    return new Resend(apiKey);
  };

  // Email subscription endpoint
  app.post('/api/subscribe', async (req: Request, res: Response) => {
    try {
      const { email, name, country, interestedInSpeaking, wantToVolunteer } =
        req.body;

      // Validate required fields
      if (!email || !email.includes('@')) {
        return res.status(400).json({
          success: false,
          message: 'Valid email is required',
        });
      }

      // Store subscription (for now, just log it - you can add database later)
      console.log('New subscription:', {
        email,
        name,
        country,
        interestedInSpeaking,
        wantToVolunteer,
      });

      const resend = getResend();
      const response = await resend.emails.send({
        from: 'Angular Voices of Asia <team@angular-voices.asia>',
        to: email,
        subject: 'Welcome to Angular Voices of Asia! 🎉',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #9c27b0; margin: 0;">Angular Voices of Asia</h1>
                <p style="color: #666; margin: 10px 0;">Uniting the Angular community across Asia</p>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #333; margin-top: 0;">Welcome aboard! 🚀</h2>
                <p style="color: #555; line-height: 1.6;">
                  Thank you for subscribing to Angular Voices of Asia! We're excited to have you join our community.
                </p>
                ${
                  name
                    ? `<p style="color: #555;"><strong>Name:</strong> ${name}</p>`
                    : ''
                }
                ${
                  country
                    ? `<p style="color: #555;"><strong>Country:</strong> ${country}</p>`
                    : ''
                }
              </div>

              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1976d2; margin-top: 0;">What's Next?</h3>
                <ul style="color: #555; line-height: 1.6;">
                  <li>We'll keep you updated on conference announcements</li>
                  <li>You'll receive information about speaker calls</li>
                  <li>Get early access to registration when it opens</li>
                  ${
                    interestedInSpeaking
                      ? "<li>We'll reach out about speaking opportunities</li>"
                      : ''
                  }
                  ${
                    wantToVolunteer
                      ? "<li>We'll contact you about volunteer opportunities</li>"
                      : ''
                  }
                </ul>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; font-size: 14px;">
                  Conference coming Winter 2025 • 
                  <a href="mailto:team@angularasia.dev" style="color: #9c27b0;">Contact us</a>
                </p>
              </div>
            </div>
          `,
      });

      if (response.error) {
        console.error('Email sending failed:', response.error);
        return handleFailedEMail(res);
      }

      return res.json({
        success: true,
        message: 'Subscription successful! Check your email for confirmation.',
      });
    } catch (error) {
      console.error('Subscription error:', error);
      return handleFailedEMail(res);
    }
  });
}

function handleFailedEMail(res: Response) {
  return res.status(500).json({
    success: false,
  });
}
