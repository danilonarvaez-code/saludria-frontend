import React, {
  useEffect,
  useState
} from 'react';

import {
  obtenerCitasPorPaciente,
  eliminarCita,
  actualizarCita
} from '../services/citaService';

import {
  obtenerMedicos
} from '../services/medicoService';

export function ListaCitas({
  usuario,
  recargar
}) {
  const [citas, setCitas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [citaEditando, setCitaEditando] =
    useState(null);

  const [formEdit, setFormEdit] = useState({
    especialidad: '',
    fechaHora: '',
    medicoId: ''
  });

  useEffect(() => {
    cargarDatos();
  }, [usuario, recargar]);

  const cargarDatos = async () => {
    if (!usuario?.id) {
      setCargando(false);
      setCitas([]);
      return;
    }

    try {
      setCargando(true);
      setError('');

      const [
        citasData,
        medicosData
      ] = await Promise.all([
        obtenerCitasPorPaciente(usuario.id),
        obtenerMedicos()
      ]);

      setCitas(
        Array.isArray(citasData)
          ? citasData
          : []
      );

      setMedicos(
        Array.isArray(medicosData)
          ? medicosData
          : []
      );

    } catch (err) {
      console.error(
        'Error al cargar datos:',
        err
      );

      setError(
        'No fue posible cargar las citas.'
      );

    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = async (citaId) => {
    if (
      !window.confirm(
        '¿Estás seguro de que deseas cancelar esta cita?'
      )
    ) {
      return;
    }

    try {
      await eliminarCita(citaId);

      setMensaje(
        'Cita cancelada correctamente.'
      );

      await cargarDatos();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
        error.response?.data?.mensaje ||
        'No se pudo cancelar la cita.'
      );
    }
  };

  const handleIniciarEdicion = (cita) => {
    setCitaEditando(cita.id);

    setFormEdit({
      especialidad:
        cita.especialidad || '',

      fechaHora:
        cita.fechaHora
          ? cita.fechaHora.slice(0, 16)
          : '',

      medicoId:
        cita.medico?.id
          ? String(cita.medico.id)
          : ''
    });
  };

  const handleGuardarEdicion = async (
    citaId
  ) => {
    if (!formEdit.fechaHora) {
      alert(
        'La fecha y hora son obligatorias.'
      );
      return;
    }

    if (!formEdit.medicoId) {
      alert(
        'Selecciona un médico.'
      );
      return;
    }

    try {
      await actualizarCita(
        citaId,
        {
          fechaHora:
            formEdit.fechaHora.length === 16
              ? `${formEdit.fechaHora}:00`
              : formEdit.fechaHora,

          especialidad:
            formEdit.especialidad,

          estado: 'CONFIRMADA',

          usuario: {
            id: Number(usuario.id)
          },

          medico: {
            id: Number(formEdit.medicoId)
          }
        }
      );

      setMensaje(
        'Cita actualizada correctamente.'
      );

      setCitaEditando(null);

      await cargarDatos();

    } catch (error) {
      console.error(error);

      const data = error.response?.data;

      if (data?.errores) {
        alert(
          Object.values(data.errores).join(' | ')
        );
      } else {
        alert(
          data?.error ||
          data?.mensaje ||
          'Error al actualizar la cita.'
        );
      }
    }
  };

  if (!usuario) {
    return (
      <div
        style={{
          maxWidth: '850px',
          margin: '20px auto',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px'
        }}
      >
        <h3>Mis Citas Programadas</h3>

        <p
          style={{
            color: '#777'
          }}
        >
          Selecciona un paciente para consultar
          sus citas.
        </p>
      </div>
    );
  }

  if (cargando) {
    return (
      <p>
        Cargando citas de {usuario.nombre}...
      </p>
    );
  }

  return (
    <div
      style={{
        maxWidth: '850px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff'
      }}
    >
      <h3>
        Mis Citas Programadas
      </h3>

      <p>
        Paciente:
        <strong>
          {' '}
          {usuario.nombre}
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

      {citas.length === 0 ? (
        <p
          style={{
            color: '#777'
          }}
        >
          No tienes citas agendadas por el momento.
        </p>
      ) : (
        <div
          style={{
            overflowX: 'auto'
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '10px'
            }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Especialidad</th>
                <th>Médico</th>
                <th>Fecha / Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {citas.map((cita) => (
                <tr key={cita.id}>
                  <td>{cita.id}</td>

                  <td>
                    {citaEditando === cita.id ? (
                      <select
                        value={
                          formEdit.especialidad
                        }
                        onChange={(e) =>
                          setFormEdit({
                            ...formEdit,
                            especialidad:
                              e.target.value
                          })
                        }
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
                    ) : (
                      cita.especialidad
                    )}
                  </td>

                  <td>
                    {citaEditando === cita.id ? (
                      <select
                        value={
                          formEdit.medicoId
                        }
                        onChange={(e) =>
                          setFormEdit({
                            ...formEdit,
                            medicoId:
                              e.target.value
                          })
                        }
                      >
                        <option value="">
                          -- Médico --
                        </option>

                        {medicos.map(
                          (medico) => (
                            <option
                              key={medico.id}
                              value={medico.id}
                            >
                              {medico.nombre}
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      cita.medico
                        ? `${cita.medico.nombre} - ${cita.medico.especialidad}`
                        : 'Sin médico'
                    )}
                  </td>

                  <td>
                    {citaEditando === cita.id ? (
                      <input
                        type="datetime-local"
                        value={
                          formEdit.fechaHora
                        }
                        onChange={(e) =>
                          setFormEdit({
                            ...formEdit,
                            fechaHora:
                              e.target.value
                          })
                        }
                      />
                    ) : (
                      cita.fechaHora
                        ? new Date(
                            cita.fechaHora
                          ).toLocaleString(
                            'es-CO'
                          )
                        : 'Sin fecha'
                    )}
                  </td>

                  <td>
                    {cita.estado ||
                      'ASIGNADA'}
                  </td>

                  <td>
                    {citaEditando === cita.id ? (
                      <>
                        <button
                          onClick={() =>
                            handleGuardarEdicion(
                              cita.id
                            )
                          }
                        >
                          Guardar
                        </button>

                        {' '}

                        <button
                          onClick={() =>
                            setCitaEditando(
                              null
                            )
                          }
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            handleIniciarEdicion(
                              cita
                            )
                          }
                        >
                          Editar
                        </button>

                        {' '}

                        <button
                          onClick={() =>
                            handleCancelar(
                              cita.id
                            )
                          }
                          style={{
                            color: 'red'
                          }}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ListaCitas;