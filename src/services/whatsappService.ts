import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import chalk from 'chalk';
import { formatPhoneNumber } from '../utils/formatPhoneNumber';
import { AppError } from '../utils/AppError';
import { EventEmitter } from 'events';

class WhatsAppClient extends EventEmitter {
  private client: Client;
  private isClientReady: boolean = false;

  constructor() {
    super()
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
    this.client.once('ready', () => {
      this.isClientReady = true;
      console.log(chalk.green('✅ WhatsApp Client is ready!'));
      this.emit('ready');
    });

    this.client.on('qr', (qr: string) => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on('disconnected', () => {
      this.isClientReady = false;
      console.log(chalk.red('❌ WhatsApp Client disconnected! Waiting to reconnect.'));
      // Optionally, emit a 'disconnected' event
      this.emit('disconnected');
    });
    
    this.client.initialize();
  }

  public async sendMessage(to: string, message: string) {
    if (!this.isClientReady) {
      throw new AppError('WhatsApp client is not ready yet. Please wait until it is initialized.', 500);
    }
    if (!this.client) {
      throw new AppError('WhatsApp client not initialized');
    }

    const formattedPhone = formatPhoneNumber(to);

    try {
      await this.client.sendMessage(formattedPhone, message);
    } catch (error) {
      console.error(`Erro ao enviar mensagem para ${formattedPhone}:`, error);
      throw new AppError(`Erro ao enviar mensagem para ${formattedPhone}:`);
    }
  }

  public getClient(): Client {
    if (!this.client) {
      throw new AppError('WhatsApp client not initialized');
    }
    return this.client;
  }

  public isReady(): boolean {
    return this.isClientReady;
  }
}

// Export a singleton instance of the WhatsAppClient
const whatsappClient = new WhatsAppClient();
export default whatsappClient;
