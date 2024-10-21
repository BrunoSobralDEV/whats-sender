import { NextFunction, Request, Response } from 'express';

import { messageQueue } from '../services/messageQueue';
import { AppError } from '../utils/AppError';


export const sendMessageController = async (req: Request, res: Response, next: NextFunction) => {
  const { phone, message } = req.body
  try {
    
    if (!phone || !message) {
      throw new AppError('Phone and message are required', 400);
    }

    await messageQueue.add({ phone, message }, {
      attempts: 5,
      backoff: {
        type: 'fixed',
        delay: 10000,
      },
      delay: 5000,
    });

    res.status(200).json({
      success: true,
      messaage: 'Message enqueued and event published successfully'
    })
  } catch (error) {
    console.error('Error enqueuing message or publishing event:', error);
    next(error);
  }
};
