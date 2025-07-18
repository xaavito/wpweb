// Configuración de grupos y reglas de respuesta
const gruposDeActuacion = [
  {
    nombre: 'Test bot',
    responder: () => true
  },
  {
    nombre: 'Cadena Blue',
    responder: () => {
      const date = new Date();
      // Solo responde los viernes de 9 a 12 am
      // date es un objeto Date
      const isFriday = date.getDay() === 5; // 5 = viernes
      const hour = date.getHours();
      return isFriday && hour >= 10 && hour < 12;
    } // Siempre responde
  },
  {
    nombre: 'JAPA - Organizacion',
    responder: () => {
      const date = new Date();
      // Solo responde los viernes de 9 a 12 am
      // date es un objeto Date
      const isFriday = date.getDay() === 5; // 5 = viernes
      const hour = date.getHours();
      return isFriday && hour >= 10 && hour < 12;
    } // Siempre responde
  }
];
export default gruposDeActuacion;
