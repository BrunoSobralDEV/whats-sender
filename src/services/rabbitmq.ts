import amqp from 'amqplib';
import { AppError } from '../utils/AppError';

let connection: amqp.Connection;
let channel: amqp.Channel;

export const initRabbitMQ = async () => {
  const amqpUrl = process.env.AMQP_URL || 'amqp://localhost';
  if (!amqpUrl) {
    throw new AppError('AMQP_URL is not defined in the environment variables', 500);
  }
  
  try {
    connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();
    console.log('RabbitMQ connected successfully');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
    throw new AppError('Could not connect to RabbitMQ', 500);
  }

  return { connection, channel };
};

export const getRabbitChannel = () => {
  if (!channel) {
    throw new AppError('RabbitMQ channel has not been initialized', 500);
  }
  return channel;
};