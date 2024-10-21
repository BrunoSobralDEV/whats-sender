import amqp from 'amqplib';

export const publishMessageEvent = async (message: string) => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'messageQueue';
  await channel.assertQueue(queue, { durable: true });
console.log('message ==',message);

  channel.sendToQueue(queue, Buffer.from(message));

  console.log('Message published to RabbitMQ:', message);

  // Fechar a conexão e o canal após enviar a mensagem
  await channel.close();
  await connection.close();
};
