import { app } from './app';
import dotenv from 'dotenv';
import { initRabbitMQ } from './services/rabbitmq';
import whatsappClient from './services/whatsappService';
import { consumeMessages } from './services/rabbitConsumer';
import chalk from 'chalk';
dotenv.config();

const PORT = process.env.PORT || 3333;
const HOST = process.env.HOST || 'localhost';

const startRabbitMq = async () => {
  try {
    await initRabbitMQ(); 
    if (whatsappClient.isReady()) {
      console.log(chalk.green('WhatsApp Client already ready.'));
      consumeMessages();
    } else {
      whatsappClient.once('ready', () => {
        console.log(chalk.green('Starting RabbitMQ Consumer after WhatsApp Client is ready.'));
        consumeMessages();
      });
    }

    console.log('RabbitMq is running...');
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port http://${HOST}:${PORT}`)
  startRabbitMq()
})