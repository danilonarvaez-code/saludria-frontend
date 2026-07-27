import React, { useState } from 'react';
import { RegistroUsuario } from './components/RegistroUsuario';
import { AgendarCita } from './components/AgendarCita';
import { ListaCitas } from './components/ListaCitas';

function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [recargarCitas, setRecargarCitas] = useState(false);

  // Función para refrescar el historial cuando se crea una cita
  const handleCitaCreada = () => {
    setRecargarCitas((prev) => !prev);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
      <h1>🏥 Sistema de Gestión de Citas - Saludría</h1>

      {!usuarioActual ? (
        <RegistroUsuario onUsuarioSeleccionado={(usuario) => setUsuarioActual(usuario)} />
      ) : (
        <div>
          <div style={{ backgroundColor: '#e9ecef', padding: '10px 20px', borderRadius: '5px', display: 'inline-block', marginBottom: '20px' }}>
            <span>Paciente Activo: <strong>{usuarioActual.nombre}</strong> (ID: {usuarioActual.id}) </span>
            <button 
              onClick={() => setUsuarioActual(null)} 
              style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #999' }}
            >
              Cambiar Paciente
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {/* Formulario a la izquierda */}
            <AgendarCita usuario={usuarioActual} onCitaCreada={handleCitaCreada} />
            
            {/* Tabla del historial a la derecha */}
            <ListaCitas usuario={usuarioActual} recargar={recargarCitas} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;