import React, {
  useState,
  useEffect
} from 'react';

import {
  getCitas,
  createCita,
  updateCita,
  deleteCita
} from '../services/citaService';

import {
  getUsuarios
} from '../services/usuarioService';

import {
  obtenerMedicos
} from '../services/medicoService';

const Citas = () => {

  const [formData, setFormData] =
    useState({
      fechaHora: '',
      especialidad:
        'Medicina General',
      usuarioId: '',
      medicoId: ''
    });

  const [citas, setCitas] =
    useState([]);

  const [usuarios, setUsuarios] =
    useState([]);

  const [medicos, setMedicos] =
    useState([]);

  const [editId, setEditId] =
    useState(null);

  const [error, setError] =
    useState('');

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales =
    async () => {

      try {

        const [
          citasData,
          usuariosData,
          medicosData
        ] = await Promise.all([

          getCitas(),

          getUsuarios(),

          obtenerMedicos()
        ]);

        setCitas(citasData);
        setUsuarios(usuariosData);
        setMedicos(medicosData);

      } catch (err) {

        console.error(err);

        setError(
          'No se pudieron cargar las citas, usuarios o médicos.'
        );
      }
    };

  const handleChange =
    (e) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value
      });
    };

  const handleEditar =
    (cita) => {

      setEditId(cita.id);

      setFormData({

        fechaHora:
          cita.fechaHora
            ? cita.fechaHora.substring(
                0,
                16
              )
            : '',

        especialidad:
          cita.especialidad ||
          'Medicina General',

        usuarioId:
          cita.usuario?.id || '',

        medicoId:
          cita.medico?.id || ''
      });
    };

  const resetForm =
    () => {

      setEditId(null);

      setFormData({
        fechaHora: '',
        especialidad:
          'Medicina General',
        usuarioId: '',
        medicoId: ''
      });
    };

  const handleEliminar =
    async (id) => {

      if (
        !window.confirm(
          '¿Seguro que deseas eliminar esta cita?'
        )
      ) {
        return;
      }

      try {

        await deleteCita(id);

        cargarDatosIniciales();

      } catch (err) {

        setError(
          err.response?.data?.mensaje ||
          'Error al eliminar la cita.'
        );
      }
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError('');

      if (
        !formData.fechaHora ||
        !formData.usuarioId ||
        !formData.medicoId
      ) {

        setError(
          'Fecha, paciente y médico son obligatorios.'
        );

        return;
      }

      const datosAEnviar = {

        fechaHora:
          formData.fechaHora.length === 16
            ? `${formData.fechaHora}:00`
            : formData.fechaHora,

        especialidad:
          formData.especialidad,

        usuario: {
          id: Number(
            formData.usuarioId
          )
        },

        medico: {
          id: Number(
            formData.medicoId
          )
        }
      };

      try {

        if (editId) {

          await updateCita(
            editId,
            datosAEnviar
          );

        } else {

          await createCita(
            datosAEnviar
          );
        }

        resetForm();

        cargarDatosIniciales();

      } catch (err) {

        setError(
          err.response?.data?.mensaje ||
          'Ocurrió un error al procesar la cita.'
        );
      }
    };

  return (

    <div
      style={{
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}
    >

      <h2>
        Agendamiento de Citas - Saludría
      </h2>

      {error && (
        <div
          style={{
            color: 'red',
            marginBottom: '15px'
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '30px'
        }}
      >

        <label>
          Fecha y Hora:
        </label>

        <input
          type="datetime-local"
          name="fechaHora"
          value={
            formData.fechaHora
          }
          onChange={handleChange}
          required
        />

        <label>
          Especialidad Médica:
        </label>

        <select
          name="especialidad"
          value={
            formData.especialidad
          }
          onChange={handleChange}
          required
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

        <label>
          Paciente:
        </label>

        <select
          name="usuarioId"
          value={
            formData.usuarioId
          }
          onChange={handleChange}
          required
        >

          <option value="">
            -- Elija un paciente --
          </option>

          {usuarios.map(
            (u) => (

              <option
                key={u.id}
                value={u.id}
              >
                {u.nombre}
                {' - '}
                {u.correo}
              </option>

            )
          )}

        </select>

        <label>
          Médico:
        </label>

        <select
          name="medicoId"
          value={
            formData.medicoId
          }
          onChange={handleChange}
          required
        >

          <option value="">
            -- Elija un médico --
          </option>

          {medicos.map(
            (m) => (

              <option
                key={m.id}
                value={m.id}
              >
                {m.nombre}
                {' - '}
                {m.especialidad}
              </option>

            )
          )}

        </select>

        <div>

          <button type="submit">

            {editId
              ? 'Modificar Cita'
              : 'Agendar Cita'}

          </button>

          {' '}

          {editId && (

            <button
              type="button"
              onClick={resetForm}
            >
              Cancelar
            </button>

          )}

        </div>

      </form>

      <h3>
        Citas Programadas
      </h3>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: '100%',
          borderCollapse:
            'collapse'
        }}
      >

        <thead>

          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Especialidad</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>

        </thead>

        <tbody>

          {citas.length === 0 ? (

            <tr>

              <td
                colSpan="7"
                style={{
                  textAlign: 'center'
                }}
              >
                No hay citas registradas.
              </td>

            </tr>

          ) : (

            citas.map(
              (cita) => (

                <tr key={cita.id}>

                  <td>
                    {cita.id}
                  </td>

                  <td>
                    {new Date(
                      cita.fechaHora
                    ).toLocaleString()}
                  </td>

                  <td>
                    {cita.especialidad}
                  </td>

                  <td>
                    {
                      cita.usuario
                        ?.nombre ||
                      'No asignado'
                    }
                  </td>

                  <td>
                    {
                      cita.medico
                        ? cita.medico.nombre
                        : 'No asignado'
                    }
                  </td>

                  <td>
                    {cita.estado}
                  </td>

                  <td>

                    <button
                      onClick={() =>
                        handleEditar(cita)
                      }
                    >
                      Editar
                    </button>

                    {' '}

                    <button
                      onClick={() =>
                        handleEliminar(
                          cita.id
                        )
                      }
                      style={{
                        color: 'red'
                      }}
                    >
                      Eliminar
                    </button>

                  </td>

                </tr>

              )
            )

          )}

        </tbody>

      </table>

    </div>
  );
};

export default Citas;