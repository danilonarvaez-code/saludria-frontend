import React, { useState } from 'react';
import { agendarCita } from '../services/citaService';

export function AgendarCita({ usuario, onCitaCreada }) {
  const [formData, setFormData] = useState({
    especialidad: 'Medicina General',
    fechaHora: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    // Estructura JSON requerida por Spring Boot
    const nuevaCita = {
      especialidad: formData.especialidad,
      fechaHora: formData.fechaHora,
      usuario: {
        id: usuario.id
      }
    };

    try {
      const respuesta = await agendarCita(nuevaCita);
      setMensaje(`¡Cita agendada con éxito para ${respuesta.especialidad}!`);
      
      // Limpiamos el campo de fecha y hora
      setFormData({ ...formData, fechaHora: '' });

      if (onCitaCreada) {
        onCitaCreada(respuesta);
      }
    } catch (err) {
      console.error(err);
      setError('Error al agendar la cita. Revisa la consola o el servidor.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
      <h2>Agendar Cita Médica</h2>
      <p style={{ color: '#555' }}>Paciente: <strong>{usuario.nombre}</strong></p>

      {mensaje && <p style={{ color: 'green', fontWeight: 'bold' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Especialidad:</label>
          <select
            name="especialidad"
            value={formData.especialidad}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="Medicina General">Medicina General</option>
            <option value="Odontología">Odontología</option>
            <option value="Pediatría">Pediatría</option>
            <option value="Optometría">Optometría</option>
            <option value="Cardiología">Cardiología</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Fecha y Hora:</label>
          <input
            type="datetime-local"
            name="fechaHora"
            value={formData.fechaHora}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Confirmar Cita
        </button>
      </form>
    </div>
  );
}