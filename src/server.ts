import('express-async-errors')
import { app } from './app';
import dotenv from 'dotenv';
import { AppError } from './utils/AppError';

dotenv.config();

const PORT = process.env.PORT ? process.env.PORT : 3333;
const HOST = process.env.HOST ? process.env.HOST : 'localhost';

app.use(( error, req, response, next ) => {
  //erro gerado pelo do cliente
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      error: error.message
    })
  }

  console.error(error);
  
  //Erro interno do servidor
  return response.status(500).json({
    status: "error",
    message: "Internal Server Error"
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port http://${HOST}:${PORT}`)
})