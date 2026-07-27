import axios from 'axios';

const API_URL = 'http://localhost:8080/api/citas';

export const agendarCita = async (citaData) => {
  const respuesta = await axios.post(API_URL, citaData);
  return respuesta.data;
};

export const obtenerCitasPorPaciente = async (usuarioId) => {
  const respuesta = await axios.get(`${API_URL}/usuario/${usuarioId}`);
  return respuesta.data;
};

export const eliminarCita = async (citaId) => {
  const respuesta = await axios.delete(`${API_URL}/${citaId}`);
  return respuesta.data;
};

// --- NUEVA FUNCIÓN PARA ACTUALIZAR/EDITAR ---
export const actualizarCita = async (citaId, citaData) => {
  const respuesta = await axios.put(`${API_URL}/${citaId}`, citaData);
  return respuesta.data;
};