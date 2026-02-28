import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Email
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@creativeroots.rw',
  },

  // MTN MoMo
  mtn: {
    apiKey: process.env.MTN_MOMO_API_KEY || '',
    secret: process.env.MTN_MOMO_SECRET || '',
    userId: process.env.MTN_MOMO_USER_ID || '',
    apiHost: process.env.MTN_MOMO_API_HOST || 'https://api.mtn.com/collection',
    callbackUrl: process.env.MTN_MOMO_CALLBACK_URL || '',
  },

  // WhatsApp
  whatsapp: {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    adminNumber: process.env.WHATSAPP_ADMIN_NUMBER || '',
  },

  // Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'),
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },
};
