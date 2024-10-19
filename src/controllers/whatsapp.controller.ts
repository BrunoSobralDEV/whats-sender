import { NextFunction, Request, Response } from 'express';
import { messageQueue } from '../services/messageQueue';
import { AppError } from '../utils/AppError';


export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, message } = req.body
    if (!phone || !message) {
      throw new AppError('Phone and message are required', 500);
    }

    // Enfileirar a mensagem para ser processada pelo Bull
    await messageQueue.add({ phone, message });

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
