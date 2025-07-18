import qrcode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';
import { handleMessage } from './helper.js';
//import { iniciarCron } from '../croner.js';
import { getComandos, addComando } from './command.js';

export const client = new Client(); //inicializamos una nueva instancia de conexion

//este metodo nos genera el codigo qr para crear la session de nuestro whatsapp bot
client.on('qr', (qr) => {
  console.log('QR RECEIVED');
  addComando({
    tipo: 'log',
    status: 'QR_RECEIVED',
    qr,
    date: new Date().toISOString()
  });
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  addComando({ tipo: 'log', status: 'READY', date: new Date().toISOString() });
  console.log('Client is ready!');
});

client.on('media_uploaded', async (msg) => {
  addComando({
    tipo: 'log',
    status: 'MEDIA_UPLOADED',
    date: new Date().toISOString()
  });
  //console.log('Media uploaded');
});

client.on('message_create', async (msg) => {
  addComando({
    tipo: 'log',
    status: 'MESSAGE_CREATE',
    date: new Date().toISOString()
  });
  //console.log('Message created');
  try {
    // Verifica si el mensaje fue enviado por el propio usuario
    if (msg.fromMe) {
      handleMessage(msg, client);
    }
  } catch (error) {
    console.error('Error procesando mensaje:', error);
  }
});

client.on('message', async (msg) => {
  addComando({
    tipo: 'log',
    status: 'MESSAGE',
    date: new Date().toISOString()
  });
  //console.log('Mensaje recibido');
  try {
    handleMessage(msg, client);
  } catch (error) {
    console.error('Error procesando mensaje:', error);
  }
});

client.initialize();
addComando({
  tipo: 'log',
  status: 'Cliente Inicializado',
  date: new Date().toISOString()
});
