import nodemailer from 'nodemailer';
import validator from 'validator';

export async function sendEmail(to, subject, message) {
  // Validate email format
  if (!validator.isEmail(to)) {
    throw new Error('Invalid email address');
  }

  // If the email is valid, proceed to send email using Nodemailer
  let transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: message,
  };

  try {
    // Try to send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${to}`);
  } catch (error) {
    // If an error occurs, log detailed error information
    console.error('Error sending email:', error);
    console.log('Error response:', error.response); // This will give more details about the error.
    throw new Error('Email sending failed');
  }
}
