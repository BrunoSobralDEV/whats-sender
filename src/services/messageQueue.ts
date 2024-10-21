// services/messageQueue.ts
import Bull from 'bull';
import { publishMessageEvent } from './rabbitmq';

export const messageQueue = new Bull('messageQueue', {
  redis: {
    host: 'localhost',
    port: 6380,
  },
  defaultJobOptions: {
    attempts: 5, 
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

// Defina o processamento da fila
messageQueue.process(async (job) => {
  const { phone, message } = job.data;

  try {
    // Publicar no RabbitMQ para notificar o consumidor de que o envio via WhatsApp pode começar
    await publishMessageEvent(JSON.stringify({ phone, message }));
  } catch (error) {
    console.error(`Erro ao processar a mensagem para ${phone}:`, error);
    throw new Error(`Erro ao processar a mensagem para ${phone}. ${error}`);
  }
});
