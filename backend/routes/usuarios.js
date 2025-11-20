import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

//creamos el router
const router = express.Router();

// recrear __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//crear la ruta que va hacia la base de datos .json
const dbpath = path.join(__dirname, '../data/dat.json.json');

//funcion para leer la base de datos .json
function leerDB() {
    try {
        if (!fs.existsSync(dbpath)) {
            // si no archivo no existe: crear la estructura base
            const base = { usuarios: [], productos: [] };
            fs.writeFileSync(dbpath, JSON.stringify(base, null, 2), "utf-8");
            return base;
        }
        const raw = fs.readFileSync(dbpath, "utf-8");
        return JSON.parse(raw);
    } catch (err) {
        throw new Error('Error reading database: ' + err.message);
    }
}
// uncion para guardad datos en data.json
function guardarDB(data) {
    try {
        fs.writeFileSync(dbpath, JSON.stringify(data, null, 2), "utf-8");} catch (err) {
        throw new Error('Error writing database: ' + err.message);
    }
}

//get: obtener todos los usuarios
router.get('/', (req, res, next) => {
    try {
        const db = leerDB();
        res.json(db.usuarios);
    } catch (err) {
        next(err);
    }
});
//post: crear usuario

router.post('/', (req, res, next) => {
    try {
        const db = leerDB();
        const { nombre, email } = req.body;
        //validaciones basicas
        if (!nombre || !email) {
            return res.status(400).json({ error: 'falta nombre o email' });
        }
        const nuevo = { id: Date.now(), nombre, email };
        db.usuarios.push(nuevo);
        guardarDB(db);
        res.status(201).json({ mensaje: 'usuario creado exitosamente', usuario: nuevo });

    } catch (err) {
        next(err);
    }
});