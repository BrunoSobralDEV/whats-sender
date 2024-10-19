import express, { Express, urlencoded, json } from 'express';
import cors from 'cors';

export const app: Express = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(json({ type: 'application/vnd.api+json' }));
app.use(cors());
