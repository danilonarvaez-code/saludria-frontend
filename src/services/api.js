import axios from 'axios';

// Creamos una instancia centralizada de Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // URL base de tu backend Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;