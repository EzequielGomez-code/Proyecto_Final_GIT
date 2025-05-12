const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.json());
app.use(express.static(__dirname));

// Función para leer datos
const leerDatos = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
};

// Función para guardar datos
const guardarDatos = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
};

// Obtener registros
app.get("/api/registros", (req, res) => {
  res.json(leerDatos());
});

// Agregar registro
app.post("/api/registros", (req, res) => {
  const registros = leerDatos();
  const nuevoRegistro = { id: Date.now(), ...req.body };
  registros.push(nuevoRegistro);
  guardarDatos(registros);
  res.json(nuevoRegistro);
});

// Editar registro
app.put("/api/registros/:id", (req, res) => {
  let registros = leerDatos();
  registros = registros.map(reg => reg.id == req.params.id ? { ...reg, ...req.body } : reg);
  guardarDatos(registros);
  res.json({ mensaje: "Registro actualizado" });
});

// Eliminar registro
app.delete("/api/registros/:id", (req, res) => {
  let registros = leerDatos();
  registros = registros.filter(reg => reg.id != req.params.id);
  guardarDatos(registros);
  res.json({ mensaje: "Registro eliminado" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
