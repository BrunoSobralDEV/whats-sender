import { app } from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? process.env.PORT : 3333;
const HOST = process.env.HOST ? process.env.HOST : 'localhost';

app.listen(PORT, () => {
  console.log(`Server is running on port http://${HOST}:${PORT}`)


})