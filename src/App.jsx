import React, { useState } from "react";

import { useAuth } from "./context/AuthContext";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { UsuarioPage } from "./pages/Usuarios";
import GestionMedicos from "./components/GestionMedicos";
import { AgendarCita } from "./components/AgendarCita";
import ListaCitas from "./components/ListaCitas";
import ReporteDetalleCita from "./ReporteDetalleCita";

function App() {

    const { usuario } = useAuth();

    const [modulo, setModulo] = useState(null);
    const [recargar, setRecargar] = useState(false);

    // ==========================================
    // NO AUTENTICADO
    // ==========================================

    if (!usuario) {
        return <Login />;
    }

    // ==========================================
    // CAMBIAR MÓDULO
    // ==========================================

    const rol = (usuario?.rol || "").replace("ROLE_", "").toUpperCase();

    const permisos = {
        usuarios: ["ADMIN"],
        medicos: ["ADMIN"],
        citas: ["ADMIN", "MEDICO", "PACIENTE"],
        agendar: ["PACIENTE"],
        reporte: ["ADMIN", "MEDICO"]
    };

    const mostrarModulo = (nombreModulo) => {
        if (!permisos[nombreModulo]?.includes(rol)) {
            alert("No tienes permisos para acceder a este módulo.");
            return;
        }
        setModulo(nombreModulo);
    };

    const volverDashboard = () => {
        setModulo(null);
    };

    // ==========================================
    // DASHBOARD
    // ==========================================

    if (!modulo) {
        return (
            <Dashboard
                onMostrarModulo={mostrarModulo}
            />
        );
    }

    // ==========================================
    // CONTENIDO
    // ==========================================

    return (
        <div style={styles.container}>

            <button
                onClick={volverDashboard}
                style={styles.backButton}
            >
                ← Volver al Dashboard
            </button>

            {/* USUARIOS */}

            {modulo === "usuarios" && (
                <section>
                    <h2>Gestión de Usuarios</h2>

                    <UsuarioPage />
                </section>
            )}

            {/* MÉDICOS */}

            {modulo === "medicos" && (
                <section>
                    <h2>Gestión de Médicos</h2>

                    <GestionMedicos />
                </section>
            )}

            {/* AGENDAR */}

            {modulo === "agendar" && (
                <section>
                    <h2>Agendar Cita</h2>

                    <AgendarCita
                        usuario={usuario}
                        onCitaCreada={() =>
                            setRecargar(!recargar)
                        }
                    />
                </section>
            )}

            {/* CITAS */}

            {modulo === "citas" && (
                <section>
                    <h2>Gestión de Citas</h2>

                    <ListaCitas
                        usuario={usuario}
                        recargar={recargar}
                    />
                </section>
            )}

            {/* REPORTE */}

            {modulo === "reporte" && (
                <section>
                    <h2>Reporte de Atención Médica</h2>

                    <ReporteDetalleCita
                        detalleId={2}
                    />
                </section>
            )}

        </div>
    );
}

const styles = {

    container: {
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1100px",
        margin: "0 auto"
    },

    backButton: {
        padding: "10px 20px",
        marginBottom: "20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    }

};

export default App;