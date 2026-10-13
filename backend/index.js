const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// config db
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'test',
  password: process.env.DB_PASSWORD || 'prueba2026',
  database: process.env.DB_NAME || 'chrono_react',
  port: 3306 // Puerto db
});

const db = pool.promise();

pool.getConnection((err, connection) => {
  if (err) console.error('❌ ERROR de Base de Datos:', err.message);
  else {
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

// Crear 
app.post('/api/relojes', async (req, res) => {
  try {
    const { marca, modelo, anio, precio, foto } = req.body;
    const [result] = await db.query('INSERT INTO relojes (marca, modelo, anio, precio, foto) VALUES (?, ?, ?, ?, ?)', [marca, modelo, anio, precio, foto]);
    res.json({ id: result.insertId, message: 'Reloj creado con éxito' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Editar 
app.put('/api/relojes/:id', async (req, res) => {
  try {
    const { marca, modelo, anio, precio, foto } = req.body;
    await db.query('UPDATE relojes SET marca=?, modelo=?, anio=?, precio=?, foto=? WHERE id=?', [marca, modelo, anio, precio, foto, req.params.id]);
    res.json({ message: 'Reloj actualizado con éxito' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Eliminar
app.delete('/api/relojes/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM relojes WHERE id=?', [req.params.id]);
    res.json({ message: 'Reloj eliminado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


app.get('/api/clientes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/clientes', async (req, res) => {
  try {
    const { nombre, correo, telefono } = req.body;
    await db.query('INSERT INTO clientes (nombre, correo, telefono) VALUES (?, ?, ?)', [nombre, correo, telefono]);
    res.json({ message: 'Cliente registrado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Editar cliente (PUT)
app.put('/api/clientes/:id', async (req, res) => {
  try {
    const { nombre, correo, telefono } = req.body;
    await db.query('UPDATE clientes SET nombre=?, correo=?, telefono=? WHERE id=?', [nombre, correo, telefono, req.params.id]);
    res.json({ message: 'Cliente actualizado con éxito' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Eliminar cliente (DELETE)
app.delete('/api/clientes/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM clientes WHERE id=?', [req.params.id]);
    res.json({ message: 'Cliente eliminado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/ventas', async (req, res) => {
  try {
    const query = `
      SELECT v.id, r.marca, r.modelo, c.nombre as cliente, v.fecha, v.precio_final 
      FROM ventas v
      JOIN relojes r ON v.reloj_id = r.id
      JOIN clientes c ON v.cliente_id = c.id
      ORDER BY v.fecha DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/ventas', async (req, res) => {
  try {
    const { reloj_id, cliente_id, fecha, precio_final } = req.body;
    await db.query('INSERT INTO ventas (reloj_id, cliente_id, fecha, precio_final) VALUES (?, ?, ?, ?)', [reloj_id, cliente_id, fecha, precio_final]);
    res.json({ message: 'Venta registrada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


app.get('/api/dashboard', async (req, res) => {
  try {
    const [[{ total_relojes }]] = await db.query('SELECT COUNT(*) as total_relojes FROM relojes');
    const [[{ total_ventas }]] = await db.query('SELECT COUNT(*) as total_ventas FROM ventas');
    const [[{ ingresos_totales }]] = await db.query('SELECT SUM(precio_final) as ingresos_totales FROM ventas');
    res.json({ totalRelojes: total_relojes, totalVentas: total_ventas, ingresosTotales: ingresos_totales || 0 });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend API web corriendo en http://localhost:${PORT}`);
});