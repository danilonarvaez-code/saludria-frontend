import api from "./api";

export const obtenerUsuarios = async () => (await api.get("/usuarios")).data;
export const getUsuarios = obtenerUsuarios;

export const obtenerUsuarioPorId = async (id) => (await api.get(`/usuarios/${id}`)).data;
export const getUsuarioById = obtenerUsuarioPorId;

// Registro público: siempre crea PACIENTE.
export const crearUsuario = async (usuario) => {
    const datos = { ...usuario, rol: "PACIENTE" };
    return (await api.post("/usuarios", datos)).data;
};
export const createUsuario = crearUsuario;

// Solo ADMIN puede crear usuarios con un rol distinto.
export const crearUsuarioAdmin = async (usuario) =>
    (await api.post("/usuarios/admin", usuario)).data;

export const actualizarUsuario = async (id, usuario) =>
    (await api.put(`/usuarios/${id}`, usuario)).data;
export const updateUsuario = actualizarUsuario;

export const eliminarUsuario = async (id) => {
    await api.delete(`/usuarios/${id}`);
};
export const deleteUsuario = eliminarUsuario;
