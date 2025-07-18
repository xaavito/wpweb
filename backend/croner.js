import { Cron } from 'croner';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Setup de lowdb
const adapter = new JSONFile('./db.json');
const db = new Low(adapter, { comandos: [] });
await db.read();

// Programar la tarea cada minuto
export const iniciarCron = (client) => {
  const job = new Cron(
    '* * * * *',
    { timezone: 'America/Argentina/Buenos_Aires', runOnInit: true },
    async () => {
      console.log('⏱️ Revisando base de datos...');

      await db.read();

      const ahora = new Date();
      const comandosPendientes = db.data.comandos.filter((cmd) => {
        return (
          new Date(cmd.fecha) <= ahora &&
          (cmd.ejecutado === false || cmd.ejecutado === undefined)
        );
      });

      if (comandosPendientes.length === 0) {
        console.log('✅ No hay comandos pendientes.');
        return;
      }

      for (const cmd of comandosPendientes) {
        console.log(`➡️ Ejecutando: ${cmd.accion} para ${cmd.user}`);
        // Ejecutar la acción aquí
        cmd.ejecutado = true; // Marcar como ejecutado
      }

      // Si necesitás actualizar estado o eliminar comandos ejecutados
      // db.data.comandos = db.data.comandos.filter(...)
      await db.write();
    }
  );

  console.log('Cron activo ✔️');
};
