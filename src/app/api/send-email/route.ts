
import { NextResponse } from 'next/server';
import * as sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: Request) {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not set.');
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
  }

  try {
    const { to, subject, text, html } = await request.json();

    if (!to || !subject || !text || !html) {
      return NextResponse.json({ error: 'Missing required email fields.' }, { status: 400 });
    }

    const msg = {
      to,
      from: 'admin@sudharealty.in',
      subject,
      text,
      html,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error.message);
     if (error.response) {
        console.error('SendGrid response body:', error.response.body);
     }
    // Return a more descriptive error if available
    const errorMessage = error.response?.body?.errors[0]?.message || 'Failed to send email.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
