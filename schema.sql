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

-- Actividad 5: usuarios (password guarda el HASH de bcrypt, nunca la clave)
CREATE TABLE IF NOT EXISTS usuarios (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  email    VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  rol      VARCHAR(20)  NOT NULL DEFAULT 'usuario'
);

-- Para volver admin a un usuario ya registrado (cambia el email):
-- UPDATE usuarios SET rol = 'admin' WHERE email = 'tu@correo.com';
