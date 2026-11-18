// db.js — conexión a MySQL (pool de conexiones)
require("dotenv").config();
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "tienda",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = { db };
