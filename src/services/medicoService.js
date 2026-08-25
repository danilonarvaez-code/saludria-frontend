import api from './api';

export const obtenerMedicos = async () => {
  const response = await api.get('/medicos');

  return response.data;
};

export const obtenerMedicoPorId =
  async (id) => {

    const response =
      await api.get(`/medicos/${id}`);

    return response.data;
  };

export const crearMedico =
  async (medicoData) => {

    const response =
      await api.post(
        '/medicos',
        medicoData
      );

    return response.data;
  };

export const actualizarMedico =
  async (id, medicoData) => {

    const response =
      await api.put(
        `/medicos/${id}`,
        medicoData
      );

    return response.data;
  };

export const eliminarMedico =
  async (id) => {

    await api.delete(
      `/medicos/${id}`
    );
  };