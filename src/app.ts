import('express-async-errors')
import express, { Express, urlencoded, json, NextFunction, Response, Request } from 'express';
import cors from 'cors';

import { routes } from './routes';
import { errorHanlder } from './middlewares/errors';
import whatsappClient from './services/whatsappService';
import { consumeMessages } from './services/rabbitConsumer';
import { AppError } from './utils/AppError';


export const app: Express = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(json({ type: 'application/vnd.api+json' }));
app.use(cors());
// Inicializar WhatsAppClient antes de tudo
whatsappClient;
app.use(routes);

consumeMessages().then(() => {
  console.log('RabbitMQ Consumer is running.');
}).catch((error) => {
  console.error('Erro ao iniciar o RabbitMQ Consumer:', error);
  throw new AppError('Erro no RabbitMQ Consumer',500)
});

app.use(errorHanlder)