import qrcode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';
import { handleMessage } from './helper.js';

const client = new Client(); //inicializamos una nueva instancia de conexion

//este metodo nos genera el codigo qr para crear la session de nuestro whatsapp bot
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('Client is ready!');
});

client.on('media_uploaded', async (msg) => {
  console.log('Media uploaded');
});

client.on('message_create', async (msg) => {
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
  try {
    handleMessage(msg, client);
  } catch (error) {
    console.error('Error procesando mensaje:', error);
  }
});

client.initialize();
