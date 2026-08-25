import api from "./api";

export const getCitas = async () =>
  (await api.get("/citas")).data;

export const createCita = async (citaData) =>
  (await api.post("/citas", citaData)).data;

export const updateCita = async (citaId, citaData) =>
  (await api.put(`/citas/${citaId}`, citaData)).data;

export const deleteCita = async (citaId) => {
  await api.delete(`/citas/${citaId}`);
};

export const agendarCita = createCita;

export const obtenerCitasPorPaciente = async (usuarioId) =>
  (await api.get(`/citas/usuario/${usuarioId}`)).data;

export const obtenerCitasPorMedico = async (medicoId) =>
  (await api.get(`/citas/medico/${medicoId}`)).data;

export const eliminarCita = deleteCita;

export const actualizarCita = updateCita;