import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import chalk from 'chalk';
import { formatPhoneNumber } from '../utils/formatPhoneNumber';
import { AppError } from '../utils/AppError';

class WhatsAppClient {
  private client: Client;
  private isClientReady: boolean = false;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './.wwebjs_cache'
      }),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }
    });

    this.initialize();
  }

  private initialize() {
    // When the client is ready, run this code (only once)
    this.client.once('ready', () => {
      this.isClientReady = true;
      console.log(chalk.green('✅ WhatsApp Client is ready!'));
    });

    // When the client receives QR-Code
    this.client.on('qr', (qr: string) => {
      qrcode.generate(qr, { small: true });
    });

    // Start the client
    this.client.initialize();
  }

  public async sendMessage(to: string, message: string) {
    if (!this.isClientReady) {
      throw new AppError('WhatsApp client is not ready yet. Please wait until it is initialized.');
    }
    if (!this.client) {
      throw new AppError('WhatsApp client not initialized');
    }

    // const phoneNumber = `${phone}@c.us`;
    const formattedPhone = formatPhoneNumber(to);

    try {
      await this.client.sendMessage(formattedPhone, message);
      console.log(`Mensagem enviada para ${formattedPhone}`);

    } catch (error) {
      console.error(`Erro ao enviar mensagem para ${formattedPhone}:`, error);
      throw new AppError(`Erro ao enviar mensagem para ${formattedPhone}:`);
    }
  }

  public getClient(): Client {
    if (!this.isClientReady) {
      throw new AppError('WhatsApp client is not ready yet. Please wait until it is initialized.');
    }
    if (!this.client) {
      throw new AppError('WhatsApp client not initialized');
    }
    return this.client;
  }
}

// Export a singleton instance of the WhatsAppClient
const whatsappClient = new WhatsAppClient();
export default whatsappClient;
