import express from 'express';
import userRoutes from './router/dataUsers/routes';
import alterRoutes from './router/alterUsers/routes';
import iaRoutes from './router/IA/routes';
import dotenv from 'dotenv'
import OpenAI from 'openai';

dotenv.config()

export const deepseek = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(alterRoutes);
app.use(userRoutes);
app.use(iaRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}
http://localhost:${PORT}
`);
});