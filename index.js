const qrcode = require('qrcode-terminal');
const { Client, MessageMedia } = require('whatsapp-web.js');
const client = new Client(); //inicializamos una nueva instancia de conexion

const gruposDeActuacion = ['Test bot', 'Cadena Blue'];

const gente = [
  {
    nombre: 'Hernan Blando',
    tel: '+5491135141794',
    emojis: ['❤️', '👎', '😂', '👍', '🔥', '🥳', '😎', '🙏', '👏', '💪'],
    pictures: ['riquelme-mate.jpg', 'riquelme-mate2.jpg', 'riquelme-mate3.jpg']
  }, //Herni
  {
    nombre: 'Matías Luzzi',
    tel: '+5491165166583',
    emojis: ['❤️', '👎', '😂', '👍', '🔥', '🥳', '😎', '🙏', '👏', '💪'],
    pictures: []
  }, //Maty L
  {
    nombre: 'Tato',
    tel: '+5491161199714',
    emojis: ['❤️', '👎', '😂', '👍', '🔥', '🥳', '😎', '🙏', '👏', '💪'],
    pictures: ['milei.jpg']
  }, //Tato
  {
    nombre: 'Gustavo Grandellis',
    tel: '+5491159387860',
    emojis: ['❤️', '👎', '😂', '👍', '🔥', '🥳', '😎', '🙏', '👏', '💪'],
    pictures: ['riquelme-mate.jpg']
  }, //Gusty
  {
    nombre: 'Nicolas Moreira',
    tel: '+5491165054620',
    emojis: ['❤️', '👎', '😂', '👍', '🔥', '🥳', '😎', '🙏', '👏', '💪'],
    pictures: ['racing.png', 'racing2.jpg']
  } //Nico
];

//este metodo nos genera el codigo qr para crear la session de nuestro whatsapp bot
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

const sendMessageTo = async (number, message) => {
  try {
    // Getting chatId from the number.
    // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
    const chatId = number.substring(1) + '@c.us';

    // Sending message.
    await client.sendMessage(chatId, message);
    console.log(`Mensaje enviado a ${number}: ${message}`);
  } catch (error) {
    console.error(`Error al enviar mensaje a ${number}:`, error);
  }
};

client.on('ready', async () => {
  console.log('Client is ready!');
});

const sendReactionTo = async (msg, emoji) => {
  try {
    await msg.react(emoji);
  } catch (error) {
    console.error(`Error al enviar reacción:`, error);
  }
};

client.on('media_uploaded', async (msg) => {
  console.log('Media uploaded');
});

client.on('message_create', async (msg) => {
  try {
    if (msg.fromMe) {
      await sendReactionTo(msg, '👍');
      //console.log(`Reacción enviada al mensaje: "${msg.body}"`);
    }
  } catch (error) {
    console.error('Error procesando mensaje creado:', error);
  }
  /*
  console.log('Mensaje creado:', msg.body);
  console.log('Mensaje de:', msg.from);
  console.log('Mensaje hacia:', msg.to);
  console.log('Tipo de mensaje:', msg.type);
  console.log('Fecha de mensaje:', msg.timestamp);

  const chat = await msg.getChat();
  const contact = await msg.getContact();

  console.log('Nombre del grupo:', chat.name);

  try {
    const contact2 = await client.getContactById(msg.author);
    console.log(contact2);
  } catch (error) {
    console.error('Error al obtener el contacto por ID:', error);
  }
  */
});

const reactToRecipients = async (msg) => {};

client.on('message', async (msg) => {
  //console.log('Mensaje recibido');
  try {
    const chat = await msg.getChat();
    const contact = await msg.getContact();

    // Verificá que sea un mensaje de grupo
    if (msg.from.endsWith('@g.us') && gruposDeActuacion.includes(chat.name)) {
      console.log('Mensaje de grupo recibido');

      const contact2 = await client.getContactById(msg.author);
      const persona = gente.find((p) => p.nombre === contact2.name);
      if (persona) {
        // Aquí puedes hacer lo que necesites con la persona encontrada
        console.log(`Mensaje recibido de ${persona.nombre}`);
        if (persona.pictures.length > 0) {
          // Si tiene fotos mandamos fotos aleatorias
          const randomPicture =
            persona.pictures[
              Math.floor(Math.random() * persona.pictures.length)
            ];

          const media = await MessageMedia.fromFilePath(
            `./images/${randomPicture}`
          );
          chat.sendMessage(media, {
            caption: `¡Acá tenés tu imagen, ${persona.nombre}`
          });
        } else {
          // Ejemplo: reaccionar con un emoji aleatorio de su lista
          const randomEmoji =
            persona.emojis[Math.floor(Math.random() * persona.emojis.length)];
          await msg.react(randomEmoji);
        }
      }
    }
  } catch (error) {
    console.error('Error procesando mensaje:', error);
  }
});

client.initialize();
