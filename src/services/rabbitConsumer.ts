import amqp from 'amqplib';
import whatsappClient from './whatsappService';
import prisma from '../../prisma';
import dotenv from 'dotenv';
import { AppError } from '../utils/AppError';

dotenv.config();
export const consumeMessages = async () => {
  const amqpUrl = process.env.AMQP_URL;
  if (!amqpUrl) {
    throw new AppError('AMQP_URL is not defined in the environment variables', 500);
  }
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();
  
  const queue = 'messageQueue';
  await channel.assertQueue(queue, { durable: true });

  console.log('RabbitMQ Consumer started, waiting for messages...');

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      console.log('msg=', JSON.parse(msg.content.toString()));

      const { phone, message } = JSON.parse(msg.content.toString());

      console.log(`Recebendo mensagem para envio via WhatsApp: ${phone} - ${message}`);

      // Enviar a mensagem via WhatsApp
      try {
        await whatsappClient.sendMessage(phone, message);

        console.log(`Mensagem enviada via WhatsApp com sucesso para ${phone}`);
        await prisma.message.create({
          data: {
            phone: phone,
            message: message,
            status:'sent',
          },
        });

        // Acknowledge que a mensagem foi processada com sucesso
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
        // Em caso de erro, você pode reencaminhar ou lidar com a falha conforme necessário
      }
    }
  });
};
