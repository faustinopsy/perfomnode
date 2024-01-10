import { spawn } from 'child_process';

const startPort = 3010;
const endPort = 3015;

let currentPort = startPort;

function startServer() {
  if (currentPort > endPort) {
    console.log('Todas as portas foram atribuídas.');
    return;
  }

  const server = spawn('node', ['server.js'], {
    env: { ...process.env, PORT: currentPort },
    stdio: 'inherit'
  });

  server.on('exit', (code) => {
    console.log(`Servidor na porta ${currentPort} encerrou com código de saída ${code}`);
  });

  currentPort++;
}

for (let i = 0; i <= endPort - startPort; i++) {
  setTimeout(startServer, i * 500);
}

 