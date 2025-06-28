import express from 'express';
import userRoutes from './router/dataUsers/routes';
import alterRoutes from './router/alterUsers/routes';
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(alterRoutes);
app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}
http://localhost:${PORT}
`);
});