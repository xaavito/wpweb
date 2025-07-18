import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Necesario para __dirname con ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta del archivo JSON que usará como base de datos
const file = join(__dirname, 'db.json');

const adapter = new JSONFile(file);

/*
const [,, user, accion, fecha] = process.argv

if (!user || !accion ) {
  console.error('Uso: node command.js <user> <accion>')
  process.exit(1)
}
*/

const db = new Low(adapter, { comandos: [] });

await db.read();

// Inicializá el contenido si está vacío
db.data ||= { comandos: [] };

// Agregá un nuevo comando
/*
db.data.comandos.push({
  user,
  accion,
  fecha: new Date().toISOString(),
})
*/

// Guardá los cambios
//await db.write()

//console.log('Comando guardado correctamente')

const getComandos = async () => {
  await db.read();
  const comandos = db.data.comandos || [];
  return comandos;
};

const getComandosAsLogs = async () => {
  const comandos = await getComandos();
  const comandosPendientes = comandos.filter((cmd) => {
    return cmd.ejecutado === false || cmd.ejecutado === undefined;
  });

  marcarLogsLeidos(comandosPendientes);
  return comandosPendientes;
};

const marcarLogsLeidos = (comandosPendientes) => {
  for (const cmd of comandosPendientes) {
    console.log(`➡️ Ejecutando: ${cmd.tipo} leido = true`);
    cmd.ejecutado = true; // Marcar como ejecutado/leido
  }

  db.write();
}

const addComando = async (comando) => {
  await db.read();
  db.data.comandos.push(comando);
  await db.write();
};

export { getComandos, addComando, getComandosAsLogs };
