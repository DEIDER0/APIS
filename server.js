// server.js
const express = require("express");
const app = express();
app.use(express.json());

let productos = [
  { id: 1, nombre: "Laptop", precio: 2500000, stock: 10 },
  { id: 2, nombre: "Mouse", precio: 45000, stock: 50 },
  { id: 3, nombre: "Teclado", precio: 120000, stock: 25 },
];
let siguienteId = 4;

// true si es un número válido >= 0
const esNoNegativo = (n) => typeof n === "number" && !Number.isNaN(n) && n >= 0;

// 1. GET /productos (reto: ?max=50000 filtra por precio máximo)
app.get("/productos", (req, res) => {
  const { max } = req.query;
  if (max !== undefined) {
    const limite = Number(max);
    if (Number.isNaN(limite)) {
      return res.status(400).json({ error: "max debe ser un número" });
    }
    return res.status(200).json(productos.filter((p) => p.precio <= limite));
  }
  res.status(200).json(productos);
});

// 2. GET /productos/:id
app.get("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) return res.status(404).json({ error: "No existe" });
  res.status(200).json(producto);
});

// 3. POST /productos
app.post("/productos", (req, res) => {
  const { nombre, precio, stock = 0 } = req.body;
  if (!nombre || precio === undefined) {
    return res.status(400).json({ error: "Faltan datos" });
  }
  if (!esNoNegativo(precio) || !esNoNegativo(stock)) {
    return res.status(400).json({ error: "precio y stock deben ser >= 0" });
  }
  const nuevo = { id: siguienteId++, nombre, precio, stock };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

// 4. PUT /productos/:id (exige todos los campos)
app.put("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) return res.status(404).json({ error: "No existe" });

  const { nombre, precio, stock } = req.body;
  if (!nombre || precio === undefined || stock === undefined) {
    return res.status(400).json({ error: "PUT exige nombre, precio y stock" });
  }
  if (!esNoNegativo(precio) || !esNoNegativo(stock)) {
    return res.status(400).json({ error: "precio y stock deben ser >= 0" });
  }
  producto.nombre = nombre;
  producto.precio = precio;
  producto.stock = stock;
  res.status(200).json(producto);
});

// 5. PATCH /productos/:id (solo los campos enviados)
app.patch("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) return res.status(404).json({ error: "No existe" });

  const { nombre, precio, stock } = req.body;
  if (precio !== undefined && !esNoNegativo(precio)) {
    return res.status(400).json({ error: "precio debe ser >= 0" });
  }
  if (stock !== undefined && !esNoNegativo(stock)) {
    return res.status(400).json({ error: "stock debe ser >= 0" });
  }
  if (nombre !== undefined) producto.nombre = nombre;
  if (precio !== undefined) producto.precio = precio;
  if (stock !== undefined) producto.stock = stock;
  res.status(200).json(producto);
});

// 6. DELETE /productos/:id
app.delete("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const i = productos.findIndex((p) => p.id === id);
  if (i === -1) return res.status(404).json({ error: "No existe" });
  productos.splice(i, 1);
  res.status(204).end();
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));