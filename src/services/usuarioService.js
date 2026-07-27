import axios from 'axios';

const API_URL = 'http://localhost:8080/api/usuarios';

export const obtenerUsuarios = async () => {
  const respuesta = await axios.get(API_URL);
  return respuesta.data;
};

export const crearUsuario = async (usuarioData) => {
  const respuesta = await axios.post(API_URL, usuarioData);
  return respuesta.data;
};