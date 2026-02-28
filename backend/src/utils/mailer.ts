import nodemailer from 'nodemailer';
import { env } from '../config/env';

let transporter: nodemailer.Transporter | null = null;

const initializeMailer = (): nodemailer.Transporter => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });

  return transporter;
};

export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> => {
  try {
    const mailer = initializeMailer();
    await mailer.sendMail({
      from: env.smtp.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log(`✓ Email sent to ${options.to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendBookingConfirmation = async (
  email: string,
  name: string,
  eventTitle: string
): Promise<void> => {
  const html = `
    <h2>Booking Confirmation</h2>
    <p>Dear ${name},</p>
    <p>Your booking for "<strong>${eventTitle}</strong>" has been received.</p>
    <p>We will contact you shortly with more details.</p>
    <p>Thank you for supporting Creative Roots Rwanda!</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Booking Confirmation - Creative Roots Rwanda',
    html,
    text: `Your booking for "${eventTitle}" has been received. We will contact you shortly.`,
  });
};

export const sendDonationReceipt = async (
  email: string,
  name: string,
  amount: number,
  transactionId: string
): Promise<void> => {
  const html = `
    <h2>Donation Receipt</h2>
    <p>Dear ${name},</p>
    <p>Thank you for your generous donation of <strong>${amount.toLocaleString()} RWF</strong>.</p>
    <p><strong>Transaction ID:</strong> ${transactionId}</p>
    <p>Your support helps us continue our mission to empower youth through art.</p>
    <p>Creative Roots Rwanda Team</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Donation Receipt - Creative Roots Rwanda',
    html,
    text: `Thank you for your donation of ${amount.toLocaleString()} RWF (Ref: ${transactionId})`,
  });
};

export const sendContactAutoReply = async (
  email: string,
  name: string
): Promise<void> => {
  const html = `
    <h2>We Received Your Message</h2>
    <p>Dear ${name},</p>
    <p>Thank you for contacting Creative Roots Rwanda.</p>
    <p>We have received your message and will respond as soon as possible.</p>
    <p>Best regards,<br>Creative Roots Rwanda Team</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Message Received - Creative Roots Rwanda',
    html,
    text: 'Thank you for contacting us. We will respond soon.',
  });
};
