import React, { useState } from 'react';
import { crearUsuario } from '../services/usuarioService';

export function RegistroUsuario({ onUsuarioSeleccionado }) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '123',
    rol: 'PACIENTE'
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoUsuario = await crearUsuario(formData);
      setMensaje(`¡Usuario ${nuevoUsuario.nombre} creado con éxito!`);
      
      if (onUsuarioSeleccionado) {
        onUsuarioSeleccionado(nuevoUsuario);
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error al guardar el usuario. Revisa que el backend esté encendido.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Identificación del Paciente</h2>
      
      {mensaje && <p style={{ color: 'green', fontWeight: 'bold' }}>{mensaje}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block' }}>Nombre Completo:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block' }}>Correo Electrónico:</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Registrar Paciente
        </button>
      </form>
    </div>
  );
}