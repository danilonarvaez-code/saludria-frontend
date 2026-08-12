import React, { useEffect, useState } from 'react';
import {
  crearUsuario,
  obtenerUsuarios
} from '../services/usuarioService';

export default function RegistroUsuario({
  onUsuarioSeleccionado
}) {
  const [usuarios, setUsuarios] = useState([]);

  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'PACIENTE'
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();

      const pacientes = Array.isArray(data)
        ? data.filter(
            (usuario) =>
              !usuario.rol ||
              usuario.rol.toUpperCase() === 'PACIENTE'
          )
        : [];

      setUsuarios(pacientes);
    } catch (err) {
      console.error('Error al cargar pacientes:', err);
      setError(
        'No fue posible cargar los pacientes registrados.'
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSeleccionarPaciente = (e) => {
    const id = e.target.value;

    setUsuarioSeleccionado(id);
    setMensaje('');
    setError('');

    if (!id) {
      return;
    }

    const paciente = usuarios.find(
      (usuario) => String(usuario.id) === String(id)
    );

    if (paciente && onUsuarioSeleccionado) {
      onUsuarioSeleccionado(paciente);

      setMensaje(
        `Paciente seleccionado: ${paciente.nombre}`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje('');
    setError('');

    try {
      const nuevoUsuario = await crearUsuario(formData);

      setMensaje(
        `¡Paciente ${nuevoUsuario.nombre} creado con éxito!`
      );

      setUsuarios((prev) => [
        ...prev,
        nuevoUsuario
      ]);

      setUsuarioSeleccionado(
        String(nuevoUsuario.id)
      );

      if (onUsuarioSeleccionado) {
        onUsuarioSeleccionado(nuevoUsuario);
      }

      setFormData({
        nombre: '',
        correo: '',
        password: '',
        rol: 'PACIENTE'
      });
    } catch (error) {
      console.error(error);

      const data = error.response?.data;

      if (data?.errores) {
        const mensajes = Object.values(
          data.errores
        ).join(' | ');

        setError(
          mensajes || 'Los datos ingresados no son válidos.'
        );
      } else {
        setError(
          data?.error ||
          data?.mensaje ||
          'Error al registrar el paciente.'
        );
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}
    >
      <h2>Identificación del Paciente</h2>

      <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f5f9ff',
          borderRadius: '6px'
        }}
      >
        <label>
          <strong>Seleccionar paciente existente:</strong>
        </label>

        <select
          value={usuarioSeleccionado}
          onChange={handleSeleccionarPaciente}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '8px'
          }}
        >
          <option value="">
            -- Selecciona un paciente --
          </option>

          {usuarios.map((usuario) => (
            <option
              key={usuario.id}
              value={usuario.id}
            >
              {usuario.nombre} - {usuario.correo}
            </option>
          ))}
        </select>
      </div>

      {mensaje && (
        <p
          style={{
            color: 'green',
            fontWeight: 'bold'
          }}
        >
          {mensaje}
        </p>
      )}

      {error && (
        <p
          style={{
            color: 'red',
            fontWeight: 'bold'
          }}
        >
          {error}
        </p>
      )}

      <hr />

      <h3>Registrar nuevo paciente</h3>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            marginBottom: '10px'
          }}
        >
          <label>Nombre Completo:</label>

          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={100}
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div
          style={{
            marginBottom: '10px'
          }}
        >
          <label>Correo Electrónico:</label>

          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div
          style={{
            marginBottom: '10px'
          }}
        >
          <label>Contraseña:</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            maxLength={100}
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Registrar Paciente
        </button>
      </form>
    </div>
  );
}