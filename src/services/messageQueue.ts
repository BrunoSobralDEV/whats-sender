// services/messageQueue.ts
import Bull from 'bull';
import whatsappClient from './whatsappService';
import { AppError } from '../utils/AppError';

export const messageQueue = new Bull('messageQueue', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

// Defina o processamento da fila
messageQueue.process(async (job) => {
  const { phone, message } = job.data;

  try {
    await whatsappClient.sendMessage(phone, message)
  } catch (error) {
    console.error(`Erro ao processar a mensagem para ${phone}:`, error);
    throw new AppError(`Erro ao processar a mensagem para ${phone}. ${error}`);
  }
});
