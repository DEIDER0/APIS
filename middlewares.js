// middlewares.js — se ejecutan ANTES de la ruta
const jwt = require("jsonwebtoken");

// Revisa que llegue "Authorization: Bearer <token>" y que el token sea válido
function verificarToken(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [tipo, token] = header.split(" ");
  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ error: "Falta el token" });
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET); // { id, rol, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o vencido" });
  }
}

// Solo deja pasar a los admin (se usa DESPUÉS de verificarToken)
function soloAdmin(req, res, next) {
  if (req.usuario?.rol !== "admin") {
    return res.status(403).json({ error: "No tienes permiso" });
  }
  next();
}

module.exports = { verificarToken, soloAdmin };
