import http from 'http';
import express from 'express';
import cors from 'cors';
const startPort = 3012;
const endPort = 3015;
let currentPort = startPort;
const app = express();
const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: '*'
  };
  
  app.use(cors(corsOptions));

  const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': 86400,
        });
        res.end();
        return;
    }
    console.log(`Recebendo requisição: ${req.method} ${req.url}, encaminhando para a porta ${currentPort}`);

    const proxyOptions = {
        hostname: 'localhost', 
        port: currentPort, 
        path: req.url, 
        method: req.method, 
        headers: req.headers 
    };

    const proxy = http.request(proxyOptions, workerRes => {
        console.log(`Requisição encaminhada com sucesso para a porta ${currentPort}`);
        workerRes.pipe(res);
    });

    proxy.on('error', (err) => {
        console.error(`Erro ao encaminhar para a porta ${currentPort}:`, err);
    });

    req.pipe(proxy);
    currentPort = currentPort >= endPort ? startPort : currentPort + 1;
});


server.listen(80, () => {
    console.log('Balanceador de carga rodando na porta 80');
});
