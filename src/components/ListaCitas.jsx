import React, { useEffect, useState } from 'react';
import { obtenerCitasPorPaciente, eliminarCita, actualizarCita } from '../services/citaService';

export function ListaCitas({ usuario, recargar }) {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  // Estado para controlar qué cita se está editando
  const [citaEditando, setCitaEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({ especialidad: '', fechaHora: '' });

  useEffect(() => {
    cargarCitas();
  }, [usuario, recargar]);

  const cargarCitas = async () => {
    // Si no hay usuario seleccionado, no hacemos la petición para evitar el error
    if (!usuario || !usuario.id) {
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      const data = await obtenerCitasPorPaciente(usuario.id);
      setCitas(data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = async (citaId) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      try {
        await eliminarCita(citaId);
        setMensaje('Cita cancelada con éxito.');
        setCitas(citas.filter((c) => c.id !== citaId));
      } catch (error) {
        console.error('Error al eliminar cita:', error);
        alert('No se pudo cancelar la cita.');
      }
    }
  };

  // Iniciar el modo de edición para una cita
  const handleIniciarEdicion = (cita) => {
    setCitaEditando(cita.id);
    setFormEdit({
      especialidad: cita.especialidad,
      fechaHora: cita.fechaHora ? cita.fechaHora.slice(0, 16) : '' // Formato YYYY-MM-THH:mm
    });
  };

  // Guardar los cambios editados
  const handleGuardarEdicion = async (citaId) => {
    try {
      const citaActualizada = {
        especialidad: formEdit.especialidad,
        fechaHora: formEdit.fechaHora,
        usuario: { id: usuario.id }
      };

      await actualizarCita(citaId, citaActualizada);
      setMensaje('Cita actualizada correctamente.');
      setCitaEditando(null);
      cargarCitas(); // Recargar lista
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      alert('Error al intentar actualizar la cita.');
    }
  };

  if (cargando) return <p>Cargando tus citas...</p>;

  return (
    <div style={{ maxWidth: '650px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h3>Mis Citas Programadas</h3>

      {mensaje && <p style={{ color: 'green', fontWeight: 'bold' }}>{mensaje}</p>}

      {citas.length === 0 ? (
        <p style={{ color: '#777' }}>No tienes citas agendadas por el momento.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Especialidad</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Fecha / Hora</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{cita.id}</td>

                {citaEditando === cita.id ? (
                  // MODO EDICIÓN
                  <>
                    <td style={{ padding: '5px' }}>
                      <select
                        value={formEdit.especialidad}
                        onChange={(e) => setFormEdit({ ...formEdit, especialidad: e.target.value })}
                        style={{ padding: '5px' }}
                      >
                        <option value="Medicina General">Medicina General</option>
                        <option value="Odontología">Odontología</option>
                        <option value="Pediatría">Pediatría</option>
                        <option value="Optometría">Optometría</option>
                        <option value="Cardiología">Cardiología</option>
                      </select>
                    </td>
                    <td style={{ padding: '5px' }}>
                      <input
                        type="datetime-local"
                        value={formEdit.fechaHora}
                        onChange={(e) => setFormEdit({ ...formEdit, fechaHora: e.target.value })}
                        style={{ padding: '5px' }}
                      />
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleGuardarEdicion(cita.id)}
                        style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '5px 8px', marginRight: '5px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setCitaEditando(null)}
                        style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        X
                      </button>
                    </td>
                  </>
                ) : (
                  // MODO LECTURA NORMAL
                  <>
                    <td style={{ padding: '10px' }}>{cita.especialidad}</td>
                    <td style={{ padding: '10px' }}>{new Date(cita.fechaHora).toLocaleString()}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleIniciarEdicion(cita)}
                        style={{ backgroundColor: '#ffc107', color: '#000', border: 'none', padding: '5px 8px', marginRight: '5px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleCancelar(cita.id)}
                        style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListaCitas;