import amqp from 'amqplib';
import whatsappClient from './whatsappService';
import prisma from '../../prisma';
import dotenv from 'dotenv';
import { AppError } from '../utils/AppError';
import { getRabbitChannel } from './rabbitmq';
dotenv.config();

export const consumeMessages = async () => {
  const channel = getRabbitChannel();
  const queue = 'messageQueue';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const { phone, message } = JSON.parse(msg.content.toString());

      try {
        await whatsappClient.sendMessage(phone, message);

        await prisma.message.create({
          data: {
            phone: phone,
            message: message,
            status:'sent',
          },
        });

        channel.ack(msg);
      } catch (error) {
        console.error(`Erro ao enviar a mensagem via WhatsApp para ${phone}:`, error);
        await prisma.message.create({
          data: {
            phone: phone,
            message: message,
            status:'error',
          },
        });
        // Requeue the message
        channel.nack(msg, false, true);
      }
    }
  });
};
