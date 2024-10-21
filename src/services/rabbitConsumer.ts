import amqp from 'amqplib';
import whatsappClient from './whatsappService';
import { formatPhoneNumber } from '../utils/formatPhoneNumber';

export const consumeMessages = async () => {
  const connection = await amqp.connect('amqp://localhost');
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

        // Acknowledge que a mensagem foi processada com sucesso
        channel.ack(msg);
      } catch (error) {
        console.error(`Erro ao enviar a mensagem via WhatsApp para ${phone}:`, error);
        // Em caso de erro, você pode reencaminhar ou lidar com a falha conforme necessário
      }
    }
  });
};
