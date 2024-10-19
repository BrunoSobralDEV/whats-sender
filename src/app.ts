import('express-async-errors')
import express, { Express, urlencoded, json, NextFunction, Response, Request } from 'express';
import cors from 'cors';

import { routes } from './routes';
import { errorHanlder } from './middlewares/errors';
import whatsappClient from './services/whatsappService';


export const app: Express = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(json({ type: 'application/vnd.api+json' }));
app.use(cors());

app.use(routes);

app.use(errorHanlder)