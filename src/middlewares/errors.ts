import { AppError } from '../utils/AppError';
import { NextFunction, Request, Response } from 'express';

export const errorHanlder = (( error: Error, req: Request, res: Response, next: NextFunction ) => {
  //erro gerado pelo do cliente
  if(error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message
    })
  } else {
    console.error(error);
    
    //Erro interno do servidor
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    })
  }

})