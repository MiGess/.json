//importaciones 
import cors from 'cors'; // permirte usa peticiones http
import express from 'express'; // framework de nodejs principal para servidor y  gestion de app
import path from 'path'; // permite manejar rutas y direcciones
import { fileURLToPath } from 'url'; // permire recrear el directorio  __dirname en modulos ES6

//imporar rutas api
import productosRoutes from './routes/productos.js';
import usuariosRoutes from './routes/usuarios.js';
import { error } from 'console';

//servidor principal y representa toda la app
const app = express();

//habilitar cours
app.use(cors());

//habilitar express.json
app.use(express.json());

//recrear __dirname en ES modeules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rutas api
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);

//servir frontend
app.use(express.static(path.join(__dirname, '../frontend')));

//middleware para manejar rutas no definidas en el backend
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error en el servidor', details: err.message });
});

//ejecutar servidor
app.listen(3000, () => {
  console.log('servidor corriendo en http://localhost:3000');
});