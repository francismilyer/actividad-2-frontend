--Crear y usar la base de datos
CREATE DATABASE IF NOT EXISTS chrono_react;
USE chrono_react;

-- Crear tabla de Relojes
CREATE TABLE IF NOT EXISTS relojes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    anio INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    foto VARCHAR(255) NOT NULL
);

-- Crear tabla de Clientes 
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(50) NOT NULL
);

-- Crear tabla de Ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reloj_id INT NOT NULL,
    cliente_id INT NOT NULL,
    fecha DATE NOT NULL,
    precio_final DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (reloj_id) REFERENCES relojes(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- DATOS DE PRUEBA

-- Insertar 5 Relojes de Lujo
INSERT INTO relojes (marca, modelo, anio, precio, foto) VALUES 
('Rolex', 'Submariner', 2024, 10500.00, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=200&q=80'),
('Omega', 'Speedmaster', 2023, 6500.00, 'https://images.unsplash.com/photo-1548171915-e76319830500?auto=format&fit=crop&w=200&q=80'),
('Cartier', 'Santos', 2025, 7800.00, 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=200&q=80'),
('Patek Philippe', 'Nautilus', 2022, 35000.00, 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=200&q=80'),
('TAG Heuer', 'Carrera', 2024, 4200.00, 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=200&q=80');

-- Insertar 5 Clientes de Prueba
INSERT INTO clientes (nombre, correo, telefono) VALUES 
('Juan Perez', 'juan@email.com', '+1234567890'),
('Maria Gomez', 'maria@email.com', '+0987654321'),
('Carlos Lopez', 'carlos@email.com', '+1122334455'),
('Ana Martinez', 'ana@email.com', '+5544332211'),
('Luis Rodriguez', 'luis@email.com', '+9988776655');

-- Insertar las 40 Ventas Simuladas (Enero a Octubre 2026)
INSERT INTO ventas (reloj_id, cliente_id, fecha, precio_final) VALUES 
-- Enero (3 ventas)
(1, 1, '2026-01-15', 10500.00), (2, 2, '2026-01-22', 6500.00), (5, 3, '2026-01-28', 4200.00),
-- Febrero (4 ventas)
(3, 4, '2026-02-05', 7800.00), (4, 5, '2026-02-14', 35000.00), (1, 2, '2026-02-18', 10500.00), (2, 1, '2026-02-25', 6500.00),
-- Marzo (5 ventas)
(5, 4, '2026-03-02', 4200.00), (3, 5, '2026-03-10', 7800.00), (1, 3, '2026-03-15', 10500.00), (4, 1, '2026-03-22', 35000.00), (2, 2, '2026-03-28', 6500.00),
-- Abril (3 ventas)
(3, 1, '2026-04-05', 7800.00), (5, 3, '2026-04-12', 4200.00), (1, 4, '2026-04-20', 10500.00),
-- Mayo (4 ventas)
(2, 5, '2026-05-03', 6500.00), (4, 2, '2026-05-11', 35000.00), (3, 3, '2026-05-19', 7800.00), (1, 1, '2026-05-26', 10500.00),
-- Junio (6 ventas)
(5, 4, '2026-06-04', 4200.00), (2, 1, '2026-06-09', 6500.00), (1, 5, '2026-06-14', 10500.00), (3, 2, '2026-06-21', 7800.00), (4, 3, '2026-06-28', 35000.00), (2, 4, '2026-06-30', 6500.00),
-- Julio (4 ventas)
(1, 2, '2026-07-07', 10500.00), (3, 1, '2026-07-15', 7800.00), (5, 5, '2026-07-22', 4200.00), (2, 3, '2026-07-29', 6500.00),
-- Agosto (4 ventas)
(4, 4, '2026-08-05', 35000.00), (1, 3, '2026-08-12', 10500.00), (3, 5, '2026-08-19', 7800.00), (5, 1, '2026-08-26', 4200.00),
-- Septiembre (5 ventas)
(2, 4, '2026-09-02', 6500.00), (1, 5, '2026-09-09', 10500.00), (4, 2, '2026-09-16', 35000.00), (3, 1, '2026-09-23', 7800.00), (5, 3, '2026-09-28', 4200.00),
-- Octubre (2 ventas)
(1, 2, '2026-10-04', 10500.00), (2, 4, '2026-10-10', 6500.00);