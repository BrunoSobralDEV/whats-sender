import('express-async-errors')
import express, { Express, urlencoded, json, NextFunction, Response, Request } from 'express';
import cors from 'cors';

import whatsappClient from './services/whatsappService';
import { errorHandler } from './middlewares/errors';
import { routes } from './routes';


export const app: Express = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(json({ type: 'application/vnd.api+json' }));
app.use(cors());
whatsappClient;
app.use(routes);

app.use(errorHandler)