const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;
const JSON_FILE = "productos.json";

app.use(express.json());
app.use(cors());

// Leer productos desde el archivo JSON
app.get("/productos", (req, res) => {
    fs.readFile(JSON_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error al leer el archivo" });
        }
        res.json(JSON.parse(data));
    });
});

// Agregar un producto
app.post("/productos", (req, res) => {
    const { category, subcategory, product } = req.body;

    if (!category || !subcategory || !product) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    fs.readFile(JSON_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error al leer el archivo" });

        let productos = JSON.parse(data);

        if (!productos[category]) productos[category] = {};
        if (!productos[category][subcategory]) productos[category][subcategory] = [];

        productos[category][subcategory].push(product);

        fs.writeFile(JSON_FILE, JSON.stringify(productos, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Error al escribir en el archivo" });
            res.json({ message: "Producto agregado con éxito", productos });
        });
    });
});

// Eliminar un producto
app.delete("/productos/:category/:subcategory/:index", (req, res) => {
    const { category, subcategory, index } = req.params;

    fs.readFile(JSON_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error al leer el archivo" });

        let productos = JSON.parse(data);
        if (!productos[category] || !productos[category][subcategory]) {
            return res.status(404).json({ error: "Categoría o subcategoría no encontrada" });
        }

        productos[category][subcategory].splice(index, 1);

        fs.writeFile(JSON_FILE, JSON.stringify(productos, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Error al escribir en el archivo" });
            res.json({ message: "Producto eliminado con éxito" });
        });
    });
});

// Editar un producto
app.put("/productos/:category/:subcategory/:index", (req, res) => {
    const { category, subcategory, index } = req.params;
    const { product } = req.body;

    if (!product) return res.status(400).json({ error: "Nuevo nombre de producto requerido" });

    fs.readFile(JSON_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error al leer el archivo" });

        let productos = JSON.parse(data);
        if (!productos[category] || !productos[category][subcategory]) {
            return res.status(404).json({ error: "Categoría o subcategoría no encontrada" });
        }

        productos[category][subcategory][index] = product;

        fs.writeFile(JSON_FILE, JSON.stringify(productos, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Error al escribir en el archivo" });
            res.json({ message: "Producto editado con éxito" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});