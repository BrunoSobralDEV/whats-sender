import { NextFunction, Request, Response } from 'express';
import { messageQueue } from '../services/messageQueue';
import { AppError } from '../utils/AppError';


export const sendMessageController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, message } = req.body
    if (!phone || !message) {
      throw new AppError('Phone and message are required', 500);
    }

    // Enfileirar a mensagem para ser processada pelo Bull
    await messageQueue.add({ phone, message }, {
      attempts: 5, // Número de tentativas
      backoff: {
        type: 'fixed', // ou 'exponential'
        delay: 5000, // Tempo em milissegundos entre as tentativas
      },
      delay: 5000,
    });

    res.status(200).json({
      success: true,
      messaage: 'Message enqueued successfully'
    })
  } catch (error) {
    console.error('Error enqueuing message:', error);
    // res.status(500).json({ error });
    next(error);
  }
};
