import gente from './contactos.js';
import gruposDeActuacion from './grupos.js';

const costoJAPA = [];

const reactToRecipients = async (msg) => {};

const sendReactionTo = async (msg, emoji) => {
  try {
    await msg.react(emoji);
  } catch (error) {
    console.error(`Error al enviar reacción:`, error);
  }
};

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

// Helper para saber si debe responder en el grupo actual
const debeResponderEnGrupo = (nombreGrupo) => {
  const grupo = gruposDeActuacion.find((g) => g.nombre === nombreGrupo);
  if (!grupo) return false;
  return grupo.responder(new Date());
};

const isMessageFromGroup = (msg) => {
  return msg.to.endsWith('@g.us');
};

const sendRandomEmojiOrPicture = async (msg, persona, chat) => {
  console.log(`Mensaje recibido de ${persona.nombre}`);
  if (persona.pictures.length > 0) {
    // Si tiene fotos mandamos fotos aleatorias
    const randomPicture =
      persona.pictures[Math.floor(Math.random() * persona.pictures.length)];

    const media = await MessageMedia.fromFilePath(`./images/${randomPicture}`);
    chat.sendMessage(media, {
      caption: `¡Acá tenés tu imagen, ${persona.nombre}`
    });
  } else {
    // Ejemplo: reaccionar con un emoji aleatorio de su lista
    const randomEmoji =
      persona.emojis[Math.floor(Math.random() * persona.emojis.length)];
    await msg.react(randomEmoji);
  }
};

const handleBotJapero = async (msg, persona) => {
  const chat = await msg.getChat();

  if (chat.name === 'Test bot' && msg.body) {
    if (msg.body.includes('#monto')) {
      console.log('El mensaje contiene #monto');
      // Aquí puedes agregar la lógica adicional que necesites
      const match = msg.body.match(/#monto\s+(\S+)/i);
      if (match && match[1]) {
        const siguientePalabra = match[1].trim();

        costoJAPA.push({ nombre: persona.nombre, monto: siguientePalabra });
        await sendReactionTo(msg, '👍');
      }
    }
    if (msg.body.includes('#total')) {
      console.log('El mensaje contiene #total');
      // Aquí puedes agregar la lógica adicional que necesites
      const total = costoJAPA.reduce(
        (acc, curr) => acc + parseFloat(curr.monto),
        0
      );
      chat.sendMessage(`El total acumulado es: $${total}`);
    }
    if (msg.body.includes('#reset')) {
      console.log('El mensaje contiene #reset');
      // Aquí puedes agregar la lógica adicional que necesites
      costoJAPA.length = 0; // Resetea el array
      await sendReactionTo(msg, '👍');
    }
  }
};

const handleSendActivity = async (msg, persona, chat) => {
  if (persona?.active) {
    // Aquí puedes hacer lo que necesites con la persona encontrada
    sendRandomEmojiOrPicture(msg, persona, chat);
  }
};

const handleMessage = async (msg, client) => {
  const chat = await msg.getChat();
  let contact;
  let persona;

  const grupo = gruposDeActuacion.find((p) => p.nombre === chat.name);
  if (isMessageFromGroup(msg) && grupo) {
    console.log(`Mensaje de grupo ${chat.name} recibido de ${msg?.author}`);

    if (msg?.author) {
      if (msg.author.includes('wid')) {
        contact = await client.getContactById(msg.author);
        persona = gente.find((p) => p.nombre === contact.name);
      } else {
        persona = gente.find((p) => p.nombre === 'Javier Gonzalez');
      }

      await handleSendActivity(msg, persona, chat);

      await handleBotJapero(msg, persona);
    }
  }
};

export {
  reactToRecipients,
  sendReactionTo,
  sendMessageTo,
  debeResponderEnGrupo,
  isMessageFromGroup,
  sendRandomEmojiOrPicture,
  handleBotJapero,
  handleSendActivity,
  handleMessage
};
