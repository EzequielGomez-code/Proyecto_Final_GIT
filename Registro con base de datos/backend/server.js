const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Inicializar aplicación Express
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para el archivo JSON que almacenará los datos
const DATA_FILE = path.join(__dirname, 'registros.json');

// Funciones para leer y escribir datos
function leerDatos() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer datos:', error);
        return [];
    }
}

function guardarDatos(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error al guardar datos:', error);
        return false;
    }
}

// Ruta para servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend-register/frontend')));

// --- RUTAS DE LA API ---

// Obtener todos los registros
app.get('/api/registros', (req, res) => {
    const registros = leerDatos();
    res.json(registros);
});

// Obtener un registro específico
app.get('/api/registros/:id', (req, res) => {
    const registros = leerDatos();
    const registro = registros.find(r => r.id == req.params.id);
    
    if (!registro) {
        return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }
    
    res.json(registro);
});

// Crear un nuevo registro
app.post('/api/registros', (req, res) => {
    const registros = leerDatos();
    const nuevoRegistro = { 
        id: Date.now(),
        ...req.body
    };
    
    registros.push(nuevoRegistro);
    
    if (guardarDatos(registros)) {
        res.status(201).json(nuevoRegistro);
    } else {
        res.status(500).json({ mensaje: 'Error al guardar el registro' });
    }
});

// Actualizar un registro existente
app.put('/api/registros/:id', (req, res) => {
    let registros = leerDatos();
    const id = req.params.id;
    
    // Verificar si el registro existe
    const indice = registros.findIndex(r => r.id == id);
    
    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }
    
    // Actualizar el registro
    registros[indice] = {
        ...registros[indice],
        ...req.body,
        id: parseInt(id) // Asegurar que el ID se mantiene como estaba
    };
    
    if (guardarDatos(registros)) {
        res.json(registros[indice]);
    } else {
        res.status(500).json({ mensaje: 'Error al actualizar el registro' });
    }
});

// Eliminar un registro
app.delete('/api/registros/:id', (req, res) => {
    let registros = leerDatos();
    const id = req.params.id;
    
    // Filtrar el registro a eliminar
    const nuevosRegistros = registros.filter(r => r.id != id);
    
    // Verificar si se encontró y eliminó algún registro
    if (nuevosRegistros.length === registros.length) {
        return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }
    
    if (guardarDatos(nuevosRegistros)) {
        res.json({ mensaje: 'Registro eliminado correctamente' });
    } else {
        res.status(500).json({ mensaje: 'Error al eliminar el registro' });
    }
});

// Ruta para cualquier otra solicitud (manejará las rutas del frontend)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-register/frontend/index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
}); 