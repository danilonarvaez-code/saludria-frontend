import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard({ onMostrarModulo }) {

    const { usuario, salir } = useAuth();

    const rol = (usuario?.rol || "").replace("ROLE_", "").toUpperCase();

    const esAdmin = rol === "ADMIN";
    const esMedico = rol === "MEDICO" || rol === "MÉDICO";
    const esPaciente = rol === "PACIENTE";

    return (
        <div style={styles.container}>

            <header style={styles.header}>

                <div>
                    <h1>Saludría</h1>

                    <p>
                        Bienvenido,{" "}
                        <strong>
                            {usuario?.nombre || "Usuario"}
                        </strong>
                    </p>

                    <p>
                        Rol:{" "}
                        <strong>
                            {usuario?.rol || "SIN ROL"}
                        </strong>
                    </p>
                </div>

                <button
                    onClick={salir}
                    style={styles.logoutButton}
                >
                    Cerrar sesión
                </button>

            </header>

            <h2 style={styles.title}>
                Panel principal
            </h2>

            <div style={styles.grid}>

                {/* ADMIN */}
                {esAdmin && (
                    <>
                        <div
                            style={styles.card}
                            onClick={() =>
                                onMostrarModulo("usuarios")
                            }
                        >
                            <h3>Gestión de Usuarios</h3>
                            <p>
                                Administrar pacientes y usuarios.
                            </p>
                        </div>

                        <div
                            style={styles.card}
                            onClick={() =>
                                onMostrarModulo("medicos")
                            }
                        >
                            <h3>Gestión de Médicos</h3>
                            <p>
                                Registrar y administrar médicos.
                            </p>
                        </div>

                        <div
                            style={styles.card}
                            onClick={() =>
                                onMostrarModulo("citas")
                            }
                        >
                            <h3>Gestión de Citas</h3>
                            <p>
                                Consultar y administrar citas.
                            </p>
                        </div>

                        <div
                            style={styles.card}
                            onClick={() =>
                                onMostrarModulo("reporte")
                            }
                        >
                            <h3>Reportes</h3>
                            <p>
                                Consultar reportes de atención médica.
                            </p>
                        </div>
                    </>
                )}

                {/* MÉDICO */}
                {esMedico && (
                    <>
                        <div
                            style={styles.card}
                            onClick={() =>
                                onMostrarModulo("citas")
                            }
                        >
                            <h3>Gestión de Citas</h3>
                            <p>
                                Consultar las citas asignadas.
                            </p>
                        </div>

                        <div
                            style={styles.card}
                            onClick={() =>
                                onMostrarModulo("reporte")
                            }
                        >
                            <h3>Reportes de Atención</h3>
                            <p>
                                Consultar información de atención.
                            </p>
                        </div>
                    </>
                )}

                {/* PACIENTE */}
                {esPaciente && (
                    <>
                        <div
                            style={styles.card}
                            onClick={() =>
                                onMostrarModulo("agendar")
                            }
                        >
                            <h3>Agendar Cita</h3>
                            <p>
                                Solicitar una nueva cita médica.
                            </p>
                        </div>

                        <div
                            style={styles.card}
                            onClick={() =>
                                onMostrarModulo("citas")
                            }
                        >
                            <h3>Mis Citas</h3>
                            <p>
                                Consultar mis citas médicas.
                            </p>
                        </div>
                    </>
                )}

            </div>

        </div>
    );
}

const styles = {

    container: {
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        boxSizing: "border-box"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
    },

    title: {
        marginBottom: "20px"
    },

    logoutButton: {
        padding: "10px 16px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
    },

    card: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        cursor: "pointer",
        borderLeft: "5px solid #007bff"
    }
};