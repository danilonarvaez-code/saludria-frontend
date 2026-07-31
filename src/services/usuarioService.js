import axios from 'axios';

const API_URL = "http://localhost:8080/api/usuarios";

// Funciones en español e inglés para evitar cualquier error de importación en tus componentes
export const obtenerUsuarios = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};
export const getUsuarios = async () => { return await obtenerUsuarios(); };

export const obtenerUsuarioPorId = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
export const getUsuarioById = async (id) => { return await obtenerUsuarioPorId(id); };

export const crearUsuario = async (usuario) => {
    const response = await axios.post(API_URL, usuario);
    return response.data;
};
export const createUsuario = async (usuario) => { return await crearUsuario(usuario); };

export const actualizarUsuario = async (id, usuario) => {
    const response = await axios.put(`${API_URL}/${id}`, usuario);
    return response.data;
};
export const updateUsuario = async (id, usuario) => { return await actualizarUsuario(id, usuario); };

export const eliminarUsuario = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
export const deleteUsuario = async (id) => { return await eliminarUsuario(id); };