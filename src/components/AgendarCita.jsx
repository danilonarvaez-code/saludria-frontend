import React, {
  useEffect,
  useState
} from 'react';

import {
  agendarCita
} from '../services/citaService';

import {
  obtenerMedicos
} from '../services/medicoService';

export function AgendarCita({
  usuario,
  onCitaCreada
}) {
  const [medicos, setMedicos] = useState([]);

  const [formData, setFormData] = useState({
    especialidad: 'Medicina General',
    fechaHora: '',
    medicoId: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarMedicos();
  }, []);

  const cargarMedicos = async () => {
    try {
      const data = await obtenerMedicos();

      setMedicos(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        'Error al cargar médicos:',
        err
      );

      setError(
        'No fue posible cargar los médicos.'
      );
    }
  };

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

    if (!usuario?.id) {
      setError(
        'Primero debes seleccionar un paciente.'
      );
      return;
    }

    if (!formData.medicoId) {
      setError(
        'Selecciona un médico antes de agendar la cita.'
      );
      return;
    }

    if (!formData.fechaHora) {
      setError(
        'Selecciona la fecha y hora de la cita.'
      );
      return;
    }

    const nuevaCita = {
      fechaHora:
        formData.fechaHora.length === 16
          ? `${formData.fechaHora}:00`
          : formData.fechaHora,

      especialidad:
        formData.especialidad,

      estado: 'ASIGNADA',

      usuario: {
        id: Number(usuario.id)
      },

      medico: {
        id: Number(formData.medicoId)
      }
    };

    try {
      const respuesta =
        await agendarCita(nuevaCita);

      setMensaje(
        `Cita agendada correctamente con ${
          respuesta.medico?.nombre || 'el médico seleccionado'
        }.`
      );

      setFormData({
        especialidad: 'Medicina General',
        fechaHora: '',
        medicoId: ''
      });

      if (onCitaCreada) {
        onCitaCreada(respuesta);
      }

    } catch (err) {
      console.error(err);

      const data = err.response?.data;

      if (data?.errores) {
        const mensajes = Object.values(
          data.errores
        ).join(' | ');

        setError(
          mensajes || 'Los datos de la cita no son válidos.'
        );
      } else {
        setError(
          data?.error ||
          data?.mensaje ||
          'Error al agendar la cita.'
        );
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: '450px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fdfdfd'
      }}
    >
      <h2>Agendar Cita Médica</h2>

      <p>
        Paciente:
        <strong>
          {' '}
          {usuario?.nombre}
        </strong>
      </p>

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

      <form onSubmit={handleSubmit}>
        <div
          style={{
            marginBottom: '15px'
          }}
        >
          <label>Especialidad:</label>

          <select
            name="especialidad"
            value={formData.especialidad}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px'
            }}
          >
            <option>
              Medicina General
            </option>

            <option>
              Odontología
            </option>

            <option>
              Pediatría
            </option>

            <option>
              Optometría
            </option>

            <option>
              Cardiología
            </option>
          </select>
        </div>

        <div
          style={{
            marginBottom: '15px'
          }}
        >
          <label>Médico:</label>

          <select
            name="medicoId"
            value={formData.medicoId}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px'
            }}
          >
            <option value="">
              -- Selecciona un médico --
            </option>

            {medicos.map((medico) => (
              <option
                key={medico.id}
                value={medico.id}
              >
                {medico.nombre}
                {' - '}
                {medico.especialidad}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            marginBottom: '15px'
          }}
        >
          <label>Fecha y Hora:</label>

          <input
            type="datetime-local"
            name="fechaHora"
            value={formData.fechaHora}
            onChange={handleChange}
            required
            min={new Date()
              .toISOString()
              .slice(0, 16)}
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
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Confirmar Cita
        </button>
      </form>
    </div>
  );
}

export default AgendarCita;