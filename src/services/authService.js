import api from "./api";

export async function login(correo, password) {
    const response = await api.post("/auth/login", { correo, password });
    return response.data;
}

export function guardarSesion(usuario) {
    localStorage.setItem("saludria_usuario", JSON.stringify(usuario));

    if (usuario?.token) {
        localStorage.setItem("saludria_token", usuario.token);
    }
}

export function obtenerSesion() {
    const usuario = localStorage.getItem("saludria_usuario");

    if (!usuario) return null;

    try {
        return JSON.parse(usuario);
    } catch {
        cerrarSesion();
        return null;
    }
}

export function obtenerToken() {
    return localStorage.getItem("saludria_token");
}

export function cerrarSesion() {
    localStorage.removeItem("saludria_usuario");
    localStorage.removeItem("saludria_token");
}
