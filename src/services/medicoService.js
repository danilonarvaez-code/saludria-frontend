import api from './api'; // Usamos la instancia centralizada 'api' de tu proyecto

export const obtenerMedicos = async () => {
  const response = await api.get('/medicos');
  return response.data;
};

export const crearMedico = async (medicoData) => {
  const response = await api.post('/medicos', medicoData);
  return response.data;
};

export const eliminarMedico = async (id) => {
  await api.delete(`/medicos/${id}`);
};