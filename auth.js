// auth.js — POST /registro y POST /login
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("./db");

const router = express.Router();

// POST /registro
router.post("/registro", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      typeof email !== "string" || !email.includes("@") ||
      typeof password !== "string" || password.length < 6
    ) {
      return res
        .status(400)
        .json({ error: "Se requiere un email válido y una clave de mínimo 6 caracteres" });
    }

    const hash = await bcrypt.hash(password, 10); // se guarda el hash, nunca la clave
    // El rol NO se lee del body: todo el que se registra es 'usuario' (default de la tabla)
    const [resultado] = await db.query(
      "INSERT INTO usuarios (email, password) VALUES (?, ?)",
      [email, hash]
    );
    res.status(201).json({ id: resultado.insertId, email, rol: "usuario" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Ese email ya está registrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Faltan email y password" });
    }

    const [filas] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    const usuario = filas[0];
    // Mismo mensaje si no existe el email o si la clave está mal
    if (!usuario) {
      return res.status(401).json({ error: "Email o clave incorrectos" });
    }

    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) {
      return res.status(401).json({ error: "Email o clave incorrectos" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

module.exports = router;
