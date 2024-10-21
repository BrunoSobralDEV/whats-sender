import amqp from 'amqplib';
import { AppError } from '../utils/AppError';

export const publishMessageEvent = async (message: string) => {
  const amqpUrl = process.env.AMQP_URL || 'amqp://localhost';
  if (!amqpUrl) {
    throw new AppError('AMQP_URL is not defined in the environment variables', 500);
  }
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  const queue = 'messageQueue';
  await channel.assertQueue(queue, { durable: true });

  channel.sendToQueue(queue, Buffer.from(message));

  await channel.close();
  await connection.close();
};
