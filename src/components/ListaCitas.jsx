import React, { useEffect, useState } from 'react';

import {
  getCitas,
  obtenerCitasPorPaciente,
  eliminarCita,
  actualizarCita
} from '../services/citaService';

import {
  obtenerMedicos
} from '../services/medicoService';

export function ListaCitas({ usuario, recargar }) {

  const [citas, setCitas] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [citaEditando, setCitaEditando] = useState(null);

  const [formEdit, setFormEdit] = useState({
    especialidad: '',
    fechaHora: '',
    medicoId: ''
  });

  /*
   * ============================================================
   * CARGAR CITAS
   * ============================================================
   */
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
      setMensaje('');

      const rol = (usuario.rol || '')
        .replace('ROLE_', '')
        .toUpperCase();

      let citasData;

      /*
       * ADMIN y MEDICO pueden consultar las citas.
       * PACIENTE solamente consulta sus propias citas.
       */
      if (rol === 'ADMIN' || rol === 'MEDICO') {

        citasData = await getCitas();

      } else {

        citasData = await obtenerCitasPorPaciente(usuario.id);

      }

      const medicosData = await obtenerMedicos();

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
        'Error al cargar las citas:',
        err
      );

      if (err.response?.status === 403) {

        setError(
          'No tienes permisos para consultar estas citas.'
        );

      } else {

        setError(
          'No fue posible cargar las citas.'
        );
      }

      setCitas([]);

    } finally {

      setCargando(false);
    }
  };


  /*
   * ============================================================
   * OBTENER NOMBRE DEL MÉDICO
   * ============================================================
   */
  const obtenerNombreMedico = (cita) => {

    if (cita?.medico?.nombre) {
      return cita.medico.nombre;
    }

    const medico = medicos.find(
      m => Number(m.id) === Number(cita?.medico?.id)
    );

    return medico
      ? medico.nombre
      : 'Médico no asignado';
  };


  /*
   * ============================================================
   * OBTENER ESPECIALIDAD DEL MÉDICO
   * ============================================================
   */
  const obtenerEspecialidadMedico = (cita) => {

    if (cita?.medico?.especialidad) {
      return cita.medico.especialidad;
    }

    const medico = medicos.find(
      m => Number(m.id) === Number(cita?.medico?.id)
    );

    return medico
      ? medico.especialidad
      : '';
  };


  /*
   * ============================================================
   * FORMATEAR FECHA
   * ============================================================
   */
  const formatearFecha = (fecha) => {

    if (!fecha) {
      return 'Sin fecha';
    }

    try {

      const fechaObj = new Date(fecha);

      if (Number.isNaN(fechaObj.getTime())) {
        return fecha;
      }

      return fechaObj.toLocaleString(
        'es-CO',
        {
          dateStyle: 'short',
          timeStyle: 'short'
        }
      );

    } catch {

      return fecha;
    }
  };


  /*
   * ============================================================
   * EDITAR CITA
   * ============================================================
   */
  const iniciarEdicion = (cita) => {

    setMensaje('');
    setError('');

    setCitaEditando(cita);

    setFormEdit({

      especialidad:
        cita.especialidad || '',

      fechaHora:
        cita.fechaHora
          ? convertirParaInputFecha(cita.fechaHora)
          : '',

      medicoId:
        cita.medico?.id
          ? String(cita.medico.id)
          : ''
    });
  };


  /*
   * ============================================================
   * CONVERTIR FECHA PARA DATETIME-LOCAL
   * ============================================================
   */
  const convertirParaInputFecha = (fecha) => {

    if (!fecha) {
      return '';
    }

    const fechaObj = new Date(fecha);

    if (Number.isNaN(fechaObj.getTime())) {
      return '';
    }

    const offset =
      fechaObj.getTimezoneOffset();

    const fechaLocal =
      new Date(
        fechaObj.getTime() - offset * 60000
      );

    return fechaLocal
      .toISOString()
      .slice(0, 16);
  };


  /*
   * ============================================================
   * CAMBIAR CAMPOS DEL FORMULARIO
   * ============================================================
   */
  const manejarCambio = (e) => {

    const { name, value } = e.target;

    setFormEdit(prev => ({
      ...prev,
      [name]: value
    }));
  };


  /*
   * ============================================================
   * GUARDAR EDICIÓN
   * ============================================================
   */
  const guardarEdicion = async (e) => {

    e.preventDefault();

    if (!citaEditando) {
      return;
    }

    try {

      setError('');
      setMensaje('');

      const datosActualizados = {

        especialidad:
          formEdit.especialidad,

        fechaHora:
          formEdit.fechaHora,

        medico: formEdit.medicoId
          ? {
              id: Number(formEdit.medicoId)
            }
          : null
      };

      await actualizarCita(
        citaEditando.id,
        datosActualizados
      );

      setMensaje(
        'La cita fue actualizada correctamente.'
      );

      setCitaEditando(null);

      await cargarDatos();

    } catch (err) {

      console.error(
        'Error al actualizar cita:',
        err
      );

      if (err.response?.status === 403) {

        setError(
          'No tienes permisos para modificar esta cita.'
        );

      } else {

        setError(
          'No fue posible actualizar la cita.'
        );
      }
    }
  };


  /*
   * ============================================================
   * CANCELAR EDICIÓN
   * ============================================================
   */
  const cancelarEdicion = () => {

    setCitaEditando(null);
    setMensaje('');
    setError('');
  };


  /*
   * ============================================================
   * ELIMINAR CITA
   * ============================================================
   */
  const eliminar = async (id) => {

    const confirmar = window.confirm(
      '¿Está seguro de eliminar esta cita?'
    );

    if (!confirmar) {
      return;
    }

    try {

      setError('');
      setMensaje('');

      await eliminarCita(id);

      setMensaje(
        'La cita fue eliminada correctamente.'
      );

      await cargarDatos();

    } catch (err) {

      console.error(
        'Error al eliminar cita:',
        err
      );

      if (err.response?.status === 403) {

        setError(
          'No tienes permisos para eliminar esta cita.'
        );

      } else {

        setError(
          'No fue posible eliminar la cita.'
        );
      }
    }
  };


  /*
   * ============================================================
   * ESTADO DE CARGA
   * ============================================================
   */
  if (cargando) {

    return (
      <div>
        <h2>Gestión de Citas</h2>

        <p>
          Cargando citas...
        </p>
      </div>
    );
  }


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */
  return (

    <div>

      <h2>Gestión de Citas</h2>

      <h3>
        Mis Citas Programadas
      </h3>


      {/* MENSAJES */}

      {mensaje && (
        <div>
          <strong>
            {mensaje}
          </strong>
        </div>
      )}

      {error && (
        <div>
          <strong>
            {error}
          </strong>
        </div>
      )}


      {/* INFORMACIÓN DEL USUARIO */}

      {usuario && (
        <p>
          <strong>
            Usuario:
          </strong>{' '}
          {usuario.nombre}
        </p>
      )}


      {/* FORMULARIO DE EDICIÓN */}

      {citaEditando && (

        <div>

          <h3>
            Editar Cita #{citaEditando.id}
          </h3>

          <form onSubmit={guardarEdicion}>

            <div>

              <label>
                Especialidad:
              </label>

              <input
                type="text"
                name="especialidad"
                value={formEdit.especialidad}
                onChange={manejarCambio}
                required
              />

            </div>


            <div>

              <label>
                Fecha y hora:
              </label>

              <input
                type="datetime-local"
                name="fechaHora"
                value={formEdit.fechaHora}
                onChange={manejarCambio}
                required
              />

            </div>


            <div>

              <label>
                Médico:
              </label>

              <select
                name="medicoId"
                value={formEdit.medicoId}
                onChange={manejarCambio}
                required
              >

                <option value="">
                  -- Seleccione un médico --
                </option>

                {medicos.map(medico => (

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


            <br />

            <button type="submit">
              Guardar cambios
            </button>

            {' '}

            <button
              type="button"
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>

          </form>

        </div>
      )}


      {/* LISTADO */}

      {citas.length === 0 ? (

        <p>
          No tienes citas agendadas por el momento.
        </p>

      ) : (

        <table border="1">

          <thead>

            <tr>

              <th>
                ID
              </th>

              <th>
                Especialidad
              </th>

              <th>
                Médico
              </th>

              <th>
                Fecha / Hora
              </th>

              <th>
                Estado
              </th>

              <th>
                Acciones
              </th>

            </tr>

          </thead>


          <tbody>

            {citas.map(cita => (

              <tr key={cita.id}>

                <td>
                  {cita.id}
                </td>

                <td>
                  {cita.especialidad}
                </td>

                <td>

                  {obtenerNombreMedico(cita)}

                  {' - '}

                  {obtenerEspecialidadMedico(cita)}

                </td>

                <td>
                  {formatearFecha(
                    cita.fechaHora
                  )}
                </td>

                <td>
                  {cita.estado}
                </td>

                <td>

                  <button
                    type="button"
                    onClick={() =>
                      iniciarEdicion(cita)
                    }
                  >
                    Editar
                  </button>

                  {' '}

                  <button
                    type="button"
                    onClick={() =>
                      eliminar(cita.id)
                    }
                  >
                    Eliminar
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default ListaCitas;