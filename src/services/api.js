import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Agrega automáticamente el JWT a las solicitudes protegidas.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("saludria_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Si el backend rechaza el token, limpiamos la sesión local.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("saludria_usuario");
      localStorage.removeItem("saludria_token");
    }
    return Promise.reject(error);
  }
);

export default api;
