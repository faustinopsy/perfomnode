import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import bodyParser from 'body-parser';
import megaRoutes from './App/Router/megaRoutes.js';
import debug from 'debug';
import cluster from 'cluster';
import os from 'os';
import cors from 'cors';

const cpus = os.cpus();
const debugLog = debug('server.js');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(bodyParser.json());

const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: '*'
};

app.use(cors(corsOptions));
app.use('/app', megaRoutes);

const port = process.env.PORT || 0;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  cpus.forEach(_ => {
    const worker = cluster.fork();
    console.log(`Worker ${worker.process.pid} started`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
    debugLog('Starting a new worker');
    cluster.fork();
  });
} else {
  app.listen(port, () => console.log(`Worker ${process.pid} started, server listening on port ${port}`));
}
