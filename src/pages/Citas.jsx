
import React, { useState, useEffect } from 'react';
import { 
  getCitas, 
  createCita, 
  updateCita, 
  deleteCita 
} from '../services/citaService';
import { getUsuarios } from '../services/usuarioService';

const Citas = () => {
  // 1. Estados
  const [formData, setFormData] = useState({
    fechaHora: '',
    especialidad: '',
    usuarioId: ''
  });

  const [citas, setCitas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  // 2. Cargar datos al montar el componente
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [citasData, usuariosData] = await Promise.all([getCitas(), getUsuarios()]);
      setCitas(citasData);
      setUsuarios(usuariosData);
    } catch (err) {
      console.error('Error al cargar datos iniciales:', err);
      setError('No se pudieron cargar las citas o los usuarios.');
    }
  };

  // 3. Manejadores de eventos (Formulario)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditar = (cita) => {
    setEditId(cita.id);
    setFormData({
      fechaHora: cita.fechaHora ? cita.fechaHora.substring(0, 16) : '',
      especialidad: cita.especialidad || '',
      usuarioId: cita.usuario ? cita.usuario.id : ''
    });
  };

  const handleCancelarEdicion = () => {
    setEditId(null);
    setFormData({ fechaHora: '', especialidad: '', usuarioId: '' });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas cancelar esta cita?')) {
      try {
        await deleteCita(id);
        cargarDatosIniciales();
      } catch (err) {
        console.error('Error al eliminar cita:', err);
        setError('Error al intentar eliminar la cita.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fechaHora || !formData.especialidad || !formData.usuarioId) {
      setError('Por favor, rellena todos los campos.');
      return;
    }

    const fechaFormateada = formData.fechaHora.length === 16 
      ? `${formData.fechaHora}:00` 
      : formData.fechaHora;

    const datosAEnviar = {
      fechaHora: fechaFormateada,
      especialidad: formData.especialidad,
      usuario: { id: parseInt(formData.usuarioId) }
    };

    try {
      if (editId) {
        await updateCita(editId, datosAEnviar);
      } else {
        await createCita(datosAEnviar);
      }

      handleCancelarEdicion();
      cargarDatosIniciales();
    } catch (err) {
      console.error('Error al guardar cita:', err);
      setError('Ocurrió un error en el servidor al procesar la cita.');
    }
  };

  // 4. Renderizado (UI)
  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Agendamiento de Citas - Saludría</h2>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <label>Fecha y Hora:</label>
        <input
          type="datetime-local"
          name="fechaHora"
          value={formData.fechaHora}
          onChange={handleChange}
          required
        />

        <label>Especialidad Médica:</label>
        <input
          type="text"
          name="especialidad"
          placeholder="Ej: Odontología, Medicina General"
          value={formData.especialidad}
          onChange={handleChange}
          required
        />

        <label>Seleccionar Paciente (Usuario):</label>
        <select
          name="usuarioId"
          value={formData.usuarioId}
          onChange={handleChange}
          required
        >
          <option value="">-- Elija un Paciente --</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre} {u.apellido} (Doc: {u.documento || u.id})
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit">
            {editId ? 'Modificar Cita' : 'Agendar Cita'}
          </button>
          
          {editId && (
            <button type="button" onClick={handleCancelarEdicion} style={{ backgroundColor: '#f44336', color: 'white' }}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>

      <h3>Citas Programadas</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Fecha y Hora</th>
            <th>Especialidad</th>
            <th>Paciente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No hay citas registradas.</td>
            </tr>
          ) : (
            citas.map((cita) => (
              <tr key={cita.id}>
                <td>{new Date(cita.fechaHora).toLocaleString()}</td>
                <td>{cita.especialidad}</td>
                <td>
                  {cita.usuario
                    ? `${cita.usuario.nombre} ${cita.usuario.apellido}`
                    : 'Paciente no asignado'}
                </td>
                <td>
                  <button onClick={() => handleEditar(cita)}>Editar</button>{' '}
                  <button onClick={() => handleEliminar(cita.id)} style={{ color: 'red' }}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Citas;