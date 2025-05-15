import bot from '@/bot';
import express from 'express';

const app = express();

app.use(bot.webhookCallback());

export default app;
