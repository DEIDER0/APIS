-- Ejecútalo una vez en MySQL (Workbench, consola o phpMyAdmin)
CREATE DATABASE IF NOT EXISTS tienda;
USE tienda;

CREATE TABLE IF NOT EXISTS productos (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio INT NOT NULL CHECK (precio >= 0),
  stock  INT NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

INSERT INTO productos (nombre, precio, stock) VALUES
  ('Laptop', 2500000, 10),
  ('Mouse', 45000, 50),
  ('Teclado', 120000, 25);
