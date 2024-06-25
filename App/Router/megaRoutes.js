import express from 'express';
import MegaController from '../Controller/megaController.js';
const router = express.Router();
import cors from 'cors';

const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'http://localhost:8088', 'http://127.0.0.1:8088'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

router.use(cors(corsOptions));

router.options('*', cors(corsOptions), (req, res) => {
  res.sendStatus(204);
});

router.use((req, res, next) => {
  console.log(`Worker ${process.pid} recebendo requisição: ${req.method} ${req.url}`);
  console.log(res)
  next();
});

router.get('/', (req, res) => {
  res.json('Bem vindo');
});

router.post('/insert', MegaController.insert);

export default router;
