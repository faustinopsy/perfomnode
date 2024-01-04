import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'a01_teste'
});

connection.connect(error => {
  if (error) throw error;
  console.log("Conectado ao banco de dados MySQL!");
});

export default connection;
