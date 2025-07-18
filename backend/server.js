// server.js
import express from 'express';
import cors from 'cors';
import contactos from './contactos.js';
import grupos from './grupos.js';
import acciones from './acciones.js';
// just to start whatsapp client
import { client } from './index.js';
import { getComandosAsLogs } from './command.js';

const app = express();
const PORT = 3001;

// Middleware para permitir solicitudes del front (localhost:3000, por ejemplo)
app.use(
  cors({
    origin: 'http://localhost:5173'
  })
);

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/api/hello', (req, res) => {
  res.json({ message: '¡Hola desde el backend con ES Modules!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.get('/api/contactos', (req, res) => {
  console.log('Solicitando contactos');
  //console.log(contactos);
  res.json(contactos);
});

app.get('/api/grupos', (req, res) => {
  console.log('Solicitando grupos de actuación');
  //console.log(grupos);
  res.json(grupos);
});

app.get('/api/acciones', (req, res) => {
  console.log('Solicitando acciones');
  //console.log(grupos);
  res.json(acciones);
});

app.get('/api/logs', async (req, res) => {
  console.log('Solicitando logs');
  res.json(await getComandosAsLogs());
});

app.post('/api/ejecutar', (req, res) => {
  const { usuarioId, grupoNombre, accionNombre, accion } = req.body;
  console.log('Recibido:', usuarioId, grupoNombre, accionNombre, accion);

  res.json({
    mensaje: 'Parámetros recibidos correctamente',
    usuarioId,
    grupoNombre,
    accionNombre,
    accion
  });
});
