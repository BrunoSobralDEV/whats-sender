import amqp from 'amqplib';

export const publishMessageEvent = async (message: string) => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'messageQueue';
  await channel.assertQueue(queue, { durable: true });

  channel.sendToQueue(queue, Buffer.from(message));

  console.log('Message published to RabbitMQ:', message);
};
