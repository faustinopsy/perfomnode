import express from 'express';
import bodyParser from 'body-parser';
import megaRoutes from './App/Router/megaRoutes.js';
import debug from 'debug';
import cluster from 'cluster';
import os from 'os';

const cpus = os.cpus();
const debugLog = debug('server.js');
const app = express();
app.use(bodyParser.json());


app.use('/app', megaRoutes);

const port = 80;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  cpus.forEach(_ => {
    const worker = cluster.fork();
    console.log(`Worker ${worker.process.pid} started`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
    debconsole.logugLog('Starting a new worker');
    cluster.fork();
  });
} else {
  app.listen(port, () => console.log(`Worker ${process.pid} started, server listening on port ${port}`));
}
