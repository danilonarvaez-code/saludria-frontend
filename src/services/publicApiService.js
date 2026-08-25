import axios from 'axios';

// Consumo de una API Pública Externa (Advice Slip API)
export const obtenerConsejoSalud = async () => {
  try {
    const respuesta = await axios.get('https://api.adviceslip.com/advice');
    return respuesta.data.slip.advice;
  } catch (error) {
    console.error('Error al consumir la API pública:', error);
    return 'Mantente hidratado y realiza actividad física diariamente.';
  }
};