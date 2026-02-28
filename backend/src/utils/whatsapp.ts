import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';

class WhatsAppService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `https://graph.instagram.com/v17.0`,
      headers: {
        Authorization: `Bearer ${env.whatsapp.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMessage(recipientNumber: string, message: string): Promise<void> {
    try {
      await this.client.post(`/${env.whatsapp.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        to: recipientNumber.replace('+', ''),
        type: 'text',
        text: {
          body: message,
        },
      });
      console.log(`✓ WhatsApp message sent to ${recipientNumber}`);
    } catch (error) {
      console.error('WhatsApp sending failed:', error);
      throw error;
    }
  }

  async sendDonationNotification(
    name: string,
    amount: number,
    phone: string,
    transactionId: string
  ): Promise<void> {
    const message = `🎉 New Donation Received\n\nName: ${name}\nAmount: ${amount.toLocaleString()} RWF\nPhone: ${phone}\nTransaction ID: ${transactionId}\n\nThank you for supporting Creative Roots Rwanda!`;

    try {
      await this.sendMessage(env.whatsapp.adminNumber, message);
    } catch (error) {
      console.error('Failed to send donation notification:', error);
    }
  }

  async sendBookingNotification(
    name: string,
    email: string,
    eventTitle: string,
    attendees: number
  ): Promise<void> {
    const message = `📅 New Event Booking\n\nName: ${name}\nEmail: ${email}\nEvent: ${eventTitle}\nAttendees: ${attendees}\n\nPlease log in to the admin panel to manage this booking.`;

    try {
      await this.sendMessage(env.whatsapp.adminNumber, message);
    } catch (error) {
      console.error('Failed to send booking notification:', error);
    }
  }
}

export default new WhatsAppService();
