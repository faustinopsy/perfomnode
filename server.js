import express  from 'express';
import bodyParser  from 'body-parser';
import megaRoutes  from './App/Router/megaRoutes.js';

const app = express();
app.use(bodyParser.json());

app.use('/app', megaRoutes);

const port = 80;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
