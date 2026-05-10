import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

const fromAddress = process.env.EMAIL_FROM || 'INKINGI Creative Hub <no-reply@inkingi.rw>';
const adminAddress = process.env.ADMIN_NOTIFICATION_EMAIL || 'niyodidie@gmail.com';

export async function sendMail(subject: string, html: string, to = adminAddress) {
  await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    html
  });
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
  return sendMail(
    'Verify your INKINGI account',
    `<h1>Welcome to INKINGI</h1><p>Hi ${name},</p><p>Click the link below to verify your email address:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>If you did not register, ignore this email.</p>`,
    email
  );
}

export async function sendBookingNotification({ name, email, service, message }: { name: string; email: string; service: string; message: string }) {
  await sendMail(
    'New booking request received',
    `<h1>Booking request</h1><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Service:</strong> ${service}</p><p><strong>Message:</strong> ${message}</p>`,
    adminAddress
  );
  await sendMail(
    'Your INKINGI booking is received',
    `<h1>Thank you for your request</h1><p>Hi ${name},</p><p>We received your booking for <strong>${service}</strong>. Our team will review and follow up soon.</p>`,
    email
  );
}

export async function sendContactNotification({ name, email, subject, message }: { name: string; email: string; subject: string; message: string }) {
  await sendMail(
    `New contact message: ${subject}`,
    `<h1>New contact message</h1><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong> ${message}</p>`,
    adminAddress
  );
  await sendMail(
    'Your message has been received',
    `<h1>Thank you for contacting INKINGI</h1><p>Hi ${name},</p><p>We have received your message and will respond shortly.</p>`,
    email
  );
}

export async function sendResetPasswordEmail(email: string, name: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  return sendMail(
    'Reset your INKINGI password',
    `<h1>Password reset request</h1><p>Hi ${name},</p><p>Use the link below to choose a new password. This link expires in 2 hours.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    email
  );
}
