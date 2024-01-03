const qrcode = require('qrcode-terminal');
const { Client, MessageMedia } = require('whatsapp-web.js');
const client = new Client(); //inicializamos una nueva instancia de conexion


//este metodo nos genera el codigo qr para crear la session de nuestro whatsapp bot
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

//este metodo nos avisa cuando la conexion se realiza una vez escaneado nuestro qr en la terminal
/*
client.on('ready', () => {
  console.log('Client is ready!');
});
*/
//este metodo nos ayudar a capturar todos los mensajes que ingresan a nuestro whatsapp
/*
client.on('message', (message) => {
  console.log(message.body);
  //el objeto message trae una propiedad body donde se encuentra el mensaje que ingresa
  if (message.body === 'hola') {
    message.reply('¡Hola! ¿Cómo puedo ayudarte?');
  }
});
*/
client.on('ready', () => {
  console.log('Client is ready!');

  // Number where you want to send the message.
  //const number = '+5491135141794'; //Herni
  const number = '+5491165166583'; //Maty L

  // Your message.
  const text = 'Usted es un ser del bien!!!';

  // Getting chatId from the number.
  // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
  const chatId = number.substring(1) + '@c.us';

  // Sending message.
  for (let index = 0; index < 5; index++) {
    client.sendMessage(chatId, text);
  }
  const media = MessageMedia.fromFilePath('./images/prime.jpeg');
  client.sendMessage(chatId, media);
});

client.initialize();
