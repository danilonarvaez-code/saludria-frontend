import React, { useState } from 'react';
import RegistroUsuario from './components/RegistroUsuario';
import GestionMedicos from './components/GestionMedicos';
import { AgendarCita } from './components/AgendarCita'; // <--- Importamos tu componente exacto
import ListaCitas from './components/ListaCitas';

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [recargar, setRecargar] = useState(false);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Sistema de Gestión de Citas - Saludría</h1>
      
      {/* 1. Registro o Identificación del Paciente */}
      <RegistroUsuario onUsuarioSeleccionado={(usu) => {
        setUsuarioActivo(usu);
        setRecargar(!recargar);
      }} />

      {usuarioActivo && (
        <div style={{ backgroundColor: '#eef9ff', padding: '10px', borderRadius: '5px', textAlign: 'center', margin: '15px 0' }}>
          <p style={{ color: '#0056b3', margin: 0, fontWeight: 'bold' }}>
            Paciente activo: {usuarioActivo.nombre} (ID: {usuarioActivo.id})
          </p>
        </div>
      )}

      <hr style={{ margin: '30px 0' }} />
      
      {/* 2. Módulo de Gestión de Médicos */}
      <GestionMedicos />

      <hr style={{ margin: '30px 0' }} />
      
      {/* 3. Tu componente AgendarCita (Se muestra solo si hay un paciente activo) */}
      {usuarioActivo ? (
        <AgendarCita 
          usuario={usuarioActivo} 
          onCitaCreada={() => setRecargar(!recargar)} 
        />
      ) : (
        <p style={{ textAlign: 'center', color: '#d9534f', fontWeight: 'bold' }}>
          ⚠️ Registra o selecciona un paciente arriba para poder agendar una cita.
        </p>
      )}

      <hr style={{ margin: '30px 0' }} />
      
      {/* 4. Listado de Citas */}
      <ListaCitas usuario={usuarioActivo} recargar={recargar} />
    </div>
  );
}

export default App;