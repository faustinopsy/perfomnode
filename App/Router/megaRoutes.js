import express from 'express';
import MegaController from '../Controller/megaController.js';
const router = express.Router();
import cors from 'cors';

const corsOptions = {
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};

router.use(cors(corsOptions));

router.options('*', cors(corsOptions), (req, res) => {
    res.sendStatus(204);
});

router.get('/', (req, res) => {
    res.json('Bem vindo');
});
router.post('/insert', MegaController.insert);

export default router;
