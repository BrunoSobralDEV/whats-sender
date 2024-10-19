import { Request, Response } from 'express';
import { messageQueue } from '../services/messageQueue';
import { AppError } from '../utils/AppError';


export const sendMessage = async (req: Request, res: Response) => {
  const { phone, message } = req.body

  try {
    if (!phone || !message) {
      throw new AppError('Phone and message are required');
    }
    console.log('chegou aqui, controller sendMessage')
    // Formatação do número de telefone
    const phoneNumber = `${phone}@c.us`; // Formato internacional exigido pelo WhatsApp Web

    // Enfileirar a mensagem para ser processada pelo Bull
    await messageQueue.add({ phone, message });

    res.status(200).json({
      success: true,
      messaage: 'Message enqueued successfully'
    })
  } catch (error) {
    console.error('Error enqueuing message:', error);
    res.status(500).json({ error: 'Error enqueuing message' });
  }
};
