// services/publisher.ts
import chalk from 'chalk';
import { getRabbitChannel } from './rabbitmq';

export const publishMessageEvent = async (message: string) => {
  const channel = getRabbitChannel(); 
  const queue = 'messageQueue';

  try {
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(chalk.blue('📨 Message published to RabbitMQ:', message));
  } catch (error) {
    console.error('Failed to publish message to RabbitMQ:', error);
    throw error;
  }
};
