// server.js
const express = require("express");
const { db } = require("./db");
const app = express();
app.use(express.json());

// true si es un número válido >= 0
const esNoNegativo = (n) => typeof n === "number" && !Number.isNaN(n) && n >= 0;

const errorBD = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Error en la base de datos" });
};

// 1. GET /productos (reto: ?max=50000 filtra por precio máximo)
app.get("/productos", async (req, res) => {
  try {
    const { max } = req.query;
    if (max !== undefined) {
      const limite = Number(max);
      if (Number.isNaN(limite)) {
        return res.status(400).json({ error: "max debe ser un número" });
      }
      const [filas] = await db.query(
        "SELECT * FROM productos WHERE precio <= ?",
        [limite]
      );
      return res.status(200).json(filas);
    }
    const [filas] = await db.query("SELECT * FROM productos");
    res.status(200).json(filas);
  } catch (error) {
    errorBD(res, error);
  }
});

// 2. GET /productos/:id
app.get("/productos/:id", async (req, res) => {
  try {
    const [filas] = await db.query("SELECT * FROM productos WHERE id = ?", [
      req.params.id,
    ]);
    if (filas.length === 0) return res.status(404).json({ error: "No existe" });
    res.status(200).json(filas[0]);
  } catch (error) {
    errorBD(res, error);
  }
});

// 3. POST /productos
app.post("/productos", async (req, res) => {
  try {
    const { nombre, precio, stock = 0 } = req.body;
    if (!nombre || precio === undefined) {
      return res.status(400).json({ error: "Faltan datos" });
    }
    if (!esNoNegativo(precio) || !esNoNegativo(stock)) {
      return res.status(400).json({ error: "precio y stock deben ser >= 0" });
    }
    const [resultado] = await db.query(
      "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)",
      [nombre, precio, stock]
    );
    res.status(201).json({ id: resultado.insertId, nombre, precio, stock });
  } catch (error) {
    errorBD(res, error);
  }
});

// 4. PUT /productos/:id (exige todos los campos)
app.put("/productos/:id", async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({ error: "PUT exige nombre, precio y stock" });
    }
    if (!esNoNegativo(precio) || !esNoNegativo(stock)) {
      return res.status(400).json({ error: "precio y stock deben ser >= 0" });
    }
    const [resultado] = await db.query(
      "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?",
      [nombre, precio, stock, req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "No existe" });
    }
    res.status(200).json({ id: Number(req.params.id), nombre, precio, stock });
  } catch (error) {
    errorBD(res, error);
  }
});

// 5. PATCH /productos/:id (solo los campos enviados)
app.patch("/productos/:id", async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    if (precio !== undefined && !esNoNegativo(precio)) {
      return res.status(400).json({ error: "precio debe ser >= 0" });
    }
    if (stock !== undefined && !esNoNegativo(stock)) {
      return res.status(400).json({ error: "stock debe ser >= 0" });
    }

    // Arma el UPDATE solo con los campos que llegaron (los valores siguen yendo con ?)
    const campos = [];
    const valores = [];
    if (nombre !== undefined) { campos.push("nombre = ?"); valores.push(nombre); }
    if (precio !== undefined) { campos.push("precio = ?"); valores.push(precio); }
    if (stock !== undefined) { campos.push("stock = ?"); valores.push(stock); }

    if (campos.length > 0) {
      const [resultado] = await db.query(
        `UPDATE productos SET ${campos.join(", ")} WHERE id = ?`,
        [...valores, req.params.id]
      );
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ error: "No existe" });
      }
    }

    const [filas] = await db.query("SELECT * FROM productos WHERE id = ?", [
      req.params.id,
    ]);
    if (filas.length === 0) return res.status(404).json({ error: "No existe" });
    res.status(200).json(filas[0]);
  } catch (error) {
    errorBD(res, error);
  }
});

// 6. DELETE /productos/:id
app.delete("/productos/:id", async (req, res) => {
  try {
    const [resultado] = await db.query("DELETE FROM productos WHERE id = ?", [
      req.params.id,
    ]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "No existe" });
    }
    res.status(204).end();
  } catch (error) {
    errorBD(res, error);
  }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
