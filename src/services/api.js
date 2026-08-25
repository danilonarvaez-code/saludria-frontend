import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Agrega automáticamente el JWT a todas las solicitudes protegidas.
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
