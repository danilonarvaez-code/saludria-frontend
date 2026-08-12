import axios from 'axios';

const API_URL = 'http://localhost:8080/api/citas';

export const getCitas = async () => {
  const respuesta = await axios.get(API_URL);
  return respuesta.data;
};

export const createCita = async (citaData) => {
  const respuesta = await axios.post(
    API_URL,
    citaData
  );

  return respuesta.data;
};

export const updateCita = async (
  citaId,
  citaData
) => {
  const respuesta = await axios.put(
    `${API_URL}/${citaId}`,
    citaData
  );

  return respuesta.data;
};

export const deleteCita = async (citaId) => {
  await axios.delete(
    `${API_URL}/${citaId}`
  );
};

export const agendarCita = createCita;

/*
 * El backend que comprobamos correctamente
 * responde en GET /api/citas.
 *
 * Para evitar depender de un endpoint que no
 * necesitamos, obtenemos todas las citas y
 * filtramos por usuario en React.
 */
export const obtenerCitasPorPaciente = async (
  usuarioId
) => {
  const respuesta = await axios.get(API_URL);

  const citas = Array.isArray(respuesta.data)
    ? respuesta.data
    : [];

  return citas.filter(
    (cita) =>
      Number(cita.usuario?.id) === Number(usuarioId)
  );
};

export const eliminarCita = deleteCita;

export const actualizarCita = updateCita;