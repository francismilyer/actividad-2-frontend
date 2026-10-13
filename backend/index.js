const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Config  db
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'test',
  password: process.env.DB_PASSWORD || 'prueba2026',
  database: process.env.DB_NAME || 'chrono_react',
  port: 3306 // puerto db
});

const db = pool.promise();


pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ ERROR de Base de Datos:', err.message);
  } else {
    console.log('✅ ¡Conectado exitosamente a MariaDB (chrono_react)!');
    connection.release();
  }
});


app.get('/api/relojes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM relojes');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const [[{ total_relojes }]] = await db.query('SELECT COUNT(*) as total_relojes FROM relojes');
    const [[{ total_ventas }]] = await db.query('SELECT COUNT(*) as total_ventas FROM ventas');
    const [[{ ingresos_totales }]] = await db.query('SELECT SUM(precio_final) as ingresos_totales FROM ventas');
    
    res.json({
      totalRelojes: total_relojes,
      totalVentas: total_ventas,
      ingresosTotales: ingresos_totales || 0
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


const PORT = 3000; 
app.listen(PORT, () => {
  console.log(`✅ Backend API web corriendo en http://localhost:${PORT}`);
});