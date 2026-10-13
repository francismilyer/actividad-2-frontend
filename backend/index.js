const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MariaDB
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Probar conexión
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error conectando a MariaDB:', err);
    return;
  }
  console.log('¡Conectado exitosamente a MariaDB!');
  connection.release();
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API del Dashboard funcionando');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});