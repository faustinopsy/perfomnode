# Perfomnode

## Descrição

Este projeto é uma aplicação Node.js que utiliza SQLite como banco de dados. Ele fornece uma API para inserção de números em uma tabela chamada `Mega`. A aplicação é configurada para balanceamento de carga e utiliza múltiplos processos de worker para gerenciar as requisições de forma eficiente.

## Estrutura do Projeto

- `App/Database/database.js`: Configuração do banco de dados SQLite.
- `App/Model/megaModel.js`: Modelo para a tabela `Mega`.
- `App/Controller/megaController.js`: Controlador para lidar com as requisições de inserção de dados na tabela `Mega`.
- `App/Router/megaRoutes.js`: Definição das rotas da API.
- `server.js`: Configuração principal do servidor Express e Socket.io.
- `start-servers.js`: Script para iniciar múltiplos servidores em diferentes portas.
- `balanceador.js`: Implementação de um balanceador de carga para distribuir requisições entre os servidores.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/faustinopsy/perfomnode
   cd perfomnode
    ```

## Instale as dependências:
```bash
   npm install

```
## Execute a aplicação:
```bash
   npm start

```
abra outro terminal e 
```bash
   npm balanceador.js

```

## Estrutura do Projeto
- App/Database: Contém a configuração do banco de dados SQLite.
- App/Model: Contém o modelo Mega que representa a tabela no banco de dados.
- App/Controller: Contém o controlador MegaController para lidar com as operações de inserção de dados.
- App/Router: Contém as definições de rotas da API.
- server.js: Configuração principal do servidor Express e Socket.io.
- start-servers.js: Script para iniciar múltiplos servidores em diferentes portas.
- balanceador.js: Implementação de um balanceador de carga para distribuir requisições entre os servidores.
### Banco de Dados
Para armazenamento e gerenciamento de dados, utilizamos o SQLite devido à sua simplicidade e facilidade de configuração. O SQLite serve como a espinha dorsal do nosso sistema de armazenamento, lidando com operações de inserção de dados de forma eficiente e garantindo a integridade e recuperação dos dados.

## Possíveis Melhorias
Validação de Dados: Adicionar validação de dados no controlador MegaController para garantir que os números inseridos estejam dentro de um intervalo específico.
Autenticação e Autorização: Implementar autenticação e autorização para proteger as rotas da API.
Testes Automatizados: Adicionar testes automatizados para garantir a integridade do código e prevenir regressões.


# sobre os arquivos principais comentários para explicar com clareza para iniciantes
basicamente o que se segue é a tentativa de melhorar a perfomance de um serviço/servidor node para receber varias requisições e encaminhar
## server.js
```
import express from 'express'; // Importa o framework Express para criar o servidor web
import { Server } from 'socket.io'; // Importa o Socket.io para comunicação em tempo real
import http from 'http'; // Importa o módulo HTTP do Node.js para criar o servidor HTTP
import bodyParser from 'body-parser'; // Importa o body-parser para parsear requisições JSON
import megaRoutes from './App/Router/megaRoutes.js'; // Importa as rotas definidas para a aplicação
import debug from 'debug'; // Importa o módulo de debug para facilitar o log de informações
import cluster from 'cluster'; // Importa o cluster para permitir a criação de múltiplos processos de worker
import os from 'os'; // Importa o módulo OS para acessar informações sobre o sistema operacional
import cors from 'cors'; // Importa o módulo CORS para permitir requisições de diferentes origens

const cpus = os.cpus(); // Obtém informações sobre os CPUs disponíveis no sistema
const debugLog = debug('server.js'); // Configura o debug para o namespace 'server.js'
const app = express(); // Cria uma instância do Express
const server = http.createServer(app); // Cria um servidor HTTP usando a instância do Express
const io = new Server(server); // Cria uma instância do Socket.io usando o servidor HTTP

app.use(bodyParser.json()); // Configura o Express para usar o body-parser para parsear JSON

const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
  origin: ['http://example1.com', 'http://example2.com', 'http://example3.com'], // Array de origens permitidas
};

app.use(cors(corsOptions)); // Configura o Express para usar o CORS com as opções definidas

app.use('/app', megaRoutes); // Define que todas as rotas com o prefixo '/app' usarão as rotas importadas de megaRoutes

const port = process.env.PORT || 0; // Define a porta para o servidor, utilizando a variável de ambiente PORT ou 0 para escolher uma porta aleatória

if (cluster.isPrimary) { // Verifica se o processo atual é o processo primário
  console.log(`Master ${process.pid} is running`); // Loga que o processo primário está rodando

  cpus.forEach(_ => {
    const worker = cluster.fork(); // Cria um processo worker para cada CPU disponível
    console.log(`Worker ${worker.process.pid} started`); // Loga que um novo worker foi iniciado
  });

  cluster.on('exit', (worker, code, signal) => { // Define um handler para quando um processo worker é encerrado
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`); // Loga que um worker foi encerrado
    debugLog('Starting a new worker'); // Loga que um novo worker será iniciado
    cluster.fork(); // Cria um novo worker
  });
} else {
  app.listen(port, () => {
    const serverAddress = server.address();
    console.log(`Worker ${process.pid} started, server listening on address ${serverAddress.address}, port ${serverAddress.port}`);
  }); // Inicia o servidor e loga a porta e endereço onde o servidor está rodando
}
```

## start-servers.js
```
import { spawn } from 'child_process'; // Importa a função spawn do módulo child_process para criar processos filhos

const startPort = 3000; // Define a porta inicial para o primeiro servidor
const endPort = 3015; // Define a porta final para o último servidor

let currentPort = startPort; // Inicializa a variável currentPort com a porta inicial

// Função para iniciar um servidor
function startServer() {
  if (currentPort > endPort) { // Verifica se a porta atual excede a porta final
    console.log('Todas as portas foram atribuídas.'); // Loga que todas as portas foram atribuídas
    return; // Sai da função
  }

  // Cria um novo processo para rodar o servidor usando a porta atual
  const server = spawn('node', ['server.js'], {
    env: { ...process.env, PORT: currentPort }, // Passa as variáveis de ambiente, incluindo a porta atual
    stdio: 'inherit' // Herda os fluxos de entrada, saída e erro do processo pai
  });

  // Define um handler para quando o servidor é encerrado
  server.on('exit', (code) => {
    console.log(`Servidor na porta ${currentPort} encerrou com código de saída ${code}`); // Loga que o servidor na porta atual foi encerrado
  });

  currentPort++; // Incrementa a porta atual para o próximo servidor
}

// Inicia os servidores em intervalos de 500ms
for (let i = 0; i <= endPort - startPort; i++) {
  setTimeout(startServer, i * 500); // Define um intervalo para iniciar cada servidor
}

```

## balanceador.js

```
import http from 'http'; // Importa o módulo HTTP do Node.js para criar o servidor HTTP
import https from 'https'; // Importa o módulo HTTPS do Node.js para criar o servidor HTTPS
import express from 'express'; // Importa o framework Express para criar o servidor web
import cors from 'cors'; // Importa o módulo CORS para permitir requisições de diferentes origens
import dns from 'dns'; // Importa o módulo DNS para resolver endereços DNS
import dnscache from 'dnscache'; // Importa a biblioteca dnscache para cachear consultas DNS

// Configura o cache DNS com TTL de 300 segundos e tamanho do cache de 1000 entradas
const cachedDns = dnscache({
    "enable": true,
    "ttl": 300,
    "cachesize": 1000
});
dns.lookup = cachedDns.lookup; // Substitui a função de lookup DNS padrão pelo cacheado

// Cria agentes HTTP e HTTPS com keep-alive ativado para reutilizar conexões
const keepAliveAgent = new http.Agent({ keepAlive: true });
const keepAliveAgentHttps = new https.Agent({ keepAlive: true });

const startPort = 3013; // Define a porta inicial para o balanceador
const endPort = 3015; // Define a porta final para o balanceador
let currentPort = startPort; // Inicializa a variável currentPort com a porta inicial

const app = express(); // Cria uma instância do Express

// Configura as opções de CORS para permitir todas as origens e métodos
const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: '*'
};

app.use(cors(corsOptions)); // Configura o Express para usar o CORS com as opções definidas

// Cria o servidor HTTP para o balanceador de carga
const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') { // Verifica se a requisição é um preflight de CORS
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': 86400, // Tempo em segundos para cachear a resposta preflight
        });
        res.end();
        return;
    }

    console.log(`Recebendo requisição: ${req.method} ${req.url}, encaminhando para a porta ${currentPort}`);

    // Configura as opções do proxy para redirecionar a requisição
    const proxyOptions = {
        hostname: 'localhost', 
        port: currentPort, 
        path: req.url, 
        method: req.method, 
        headers: req.headers,
        agent: keepAliveAgent // Utiliza o agente keep-alive configurado
    };

    // Cria a requisição proxy para o servidor de destino
    const proxy = http.request(proxyOptions, workerRes => {
        console.log(`Requisição encaminhada com sucesso para a porta ${currentPort}`);
        workerRes.pipe(res); // Encaminha a resposta do servidor de destino para o cliente
    });

    proxy.on('error', (err) => { // Trata erros na requisição proxy
        console.error(`Erro ao encaminhar para a porta ${currentPort}:`, err);
    });

    req.pipe(proxy); // Encaminha a requisição do cliente para o servidor de destino
    currentPort = currentPort >= endPort ? startPort : currentPort + 1; // Alterna entre as portas de destino
});

// Inicia o servidor do balanceador de carga na porta 8080
server.listen(8080, () => {
    console.log('Balanceador de carga rodando na porta 8080');
});

```