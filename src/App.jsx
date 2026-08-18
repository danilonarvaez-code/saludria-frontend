import React, { useState } from 'react';

import RegistroUsuario from './components/RegistroUsuario';
import GestionMedicos from './components/GestionMedicos';
import { AgendarCita } from './components/AgendarCita';
import ListaCitas from './components/ListaCitas';
import ReporteDetalleCita from './ReporteDetalleCita';

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [recargar, setRecargar] = useState(false);
  const [mostrarReporte, setMostrarReporte] = useState(false);

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial',
        maxWidth: '1000px',
        margin: '0 auto'
      }}
    >

      {/* ENCABEZADO PRINCIPAL */}
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Sistema de Gestión de Citas - Saludría</h1>

        <p style={{ color: '#555' }}>
          Gestión integral de pacientes, médicos, citas y atención médica
        </p>
      </header>

      {/* =========================================
          1. REGISTRO / IDENTIFICACIÓN DEL PACIENTE
          ========================================= */}
      <section>
        <RegistroUsuario
          onUsuarioSeleccionado={(usu) => {
            setUsuarioActivo(usu);
            setRecargar(!recargar);
          }}
        />
      </section>

      {/* PACIENTE ACTIVO */}
      {usuarioActivo && (
        <div
          style={{
            backgroundColor: '#eef9ff',
            padding: '12px',
            borderRadius: '5px',
            textAlign: 'center',
            margin: '15px 0'
          }}
        >
          <p
            style={{
              color: '#0056b3',
              margin: 0,
              fontWeight: 'bold'
            }}
          >
            Paciente activo: {usuarioActivo.nombre} (ID: {usuarioActivo.id})
          </p>
        </div>
      )}

      <hr style={{ margin: '30px 0' }} />

      {/* =========================================
          2. GESTIÓN DE MÉDICOS
          ========================================= */}
      <section>
        <GestionMedicos />
      </section>

      <hr style={{ margin: '30px 0' }} />

      {/* =========================================
          3. AGENDAR CITA
          ========================================= */}
      <section>
        {usuarioActivo ? (
          <AgendarCita
            usuario={usuarioActivo}
            onCitaCreada={() => setRecargar(!recargar)}
          />
        ) : (
          <p
            style={{
              textAlign: 'center',
              color: '#d9534f',
              fontWeight: 'bold'
            }}
          >
            ⚠️ Registra o selecciona un paciente arriba para poder
            agendar una cita.
          </p>
        )}
      </section>

      <hr style={{ margin: '30px 0' }} />

      {/* =========================================
          4. LISTADO DE CITAS
          ========================================= */}
      <section>
        <ListaCitas
          usuario={usuarioActivo}
          recargar={recargar}
        />
      </section>

      <hr style={{ margin: '40px 0' }} />

      {/* =========================================
          5. REPORTE DE ATENCIÓN MÉDICA
          ========================================= */}
      <section>

        <div
          style={{
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}
        >
          <h2>📋 Reporte de Atención Médica</h2>

          <p>
            Consulta consolidada de la cita y su detalle de atención.
          </p>

          <button
            onClick={() => setMostrarReporte(!mostrarReporte)}
            style={{
              padding: '12px 25px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: '#333',
              color: 'white',
              fontSize: '16px'
            }}
          >
            {mostrarReporte
              ? 'Ocultar reporte'
              : '📋 Ver reporte de atención'}
          </button>
        </div>

        {mostrarReporte && (
          <ReporteDetalleCita detalleId={2} />
        )}

      </section>

      {/* =========================================
          PIE DE PÁGINA
          ========================================= */}
      <footer
        style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          borderTop: '1px solid #ddd',
          color: '#666'
        }}
      >
        <p>
          Saludría - Sistema de Gestión de Citas Médicas
        </p>

        <p>
          Proyecto ADSO - Integración de módulos
        </p>
      </footer>

    </div>
  );
}

export default App;