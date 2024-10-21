import { AppError } from '../utils/AppError';
import { NextFunction, Request, Response } from 'express';

export const errorHandler = ((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message
    })
  } else {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    })
  }

})