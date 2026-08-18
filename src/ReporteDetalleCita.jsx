import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function ReporteDetalleCita({ detalleId = 2 }) {
    const [detalle, setDetalle] = useState(null);
    const [cita, setCita] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [medico, setMedico] = useState(null);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarReporte();
    }, [detalleId]);

    const cargarReporte = async () => {
        try {
            setCargando(true);
            setError("");

            // 1. Obtener el detalle de la cita
            const respuestaDetalle = await fetch(
                `${API_URL}/api/detalle-citas/reporte/${detalleId}`
            );

            if (!respuestaDetalle.ok) {
                throw new Error(
                    "No se pudo obtener el detalle de la cita."
                );
            }

            const datosDetalle = await respuestaDetalle.json();

            setDetalle(datosDetalle);

            // 2. Obtener información de la cita
            const citaId = datosDetalle?.cita?.id;

            if (citaId) {
                const respuestaCita = await fetch(
                    `${API_URL}/api/citas/${citaId}`
                );

                if (respuestaCita.ok) {
                    const datosCita = await respuestaCita.json();

                    setCita(datosCita);

                    // 3. Obtener información del paciente
                    const usuarioId =
                        datosCita?.usuario?.id ||
                        datosDetalle?.cita?.usuario?.id;

                    if (usuarioId) {
                        const respuestaUsuario = await fetch(
                            `${API_URL}/api/usuarios/${usuarioId}`
                        );

                        if (respuestaUsuario.ok) {
                            const datosUsuario =
                                await respuestaUsuario.json();

                            setUsuario(datosUsuario);
                        }
                    }

                    // 4. Obtener información del médico
                    const medicoId =
                        datosCita?.medico?.id ||
                        datosDetalle?.cita?.medico?.id;

                    if (medicoId) {
                        const respuestaMedico = await fetch(
                            `${API_URL}/api/medicos/${medicoId}`
                        );

                        if (respuestaMedico.ok) {
                            const datosMedico =
                                await respuestaMedico.json();

                            setMedico(datosMedico);
                        }
                    }
                }
            }

        } catch (error) {
            console.error(
                "Error cargando reporte:",
                error
            );

            setError(error.message);

        } finally {
            setCargando(false);
        }
    };

    // ==========================================
    // FUNCIÓN PARA IMPRIMIR
    // ==========================================

    const imprimirReporte = () => {
        window.print();
    };

    // ==========================================
    // ESTADO DE CARGA
    // ==========================================

    if (cargando) {
        return (
            <div className="reporte-cargando">
                <h2>Generando reporte...</h2>

                <p>
                    Consultando información de la cita.
                </p>
            </div>
        );
    }

    // ==========================================
    // ESTADO DE ERROR
    // ==========================================

    if (error) {
        return (
            <div className="reporte-error">

                <h2>
                    Error al generar el reporte
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={cargarReporte}
                >
                    Reintentar
                </button>

            </div>
        );
    }

    // ==========================================
    // SIN INFORMACIÓN
    // ==========================================

    if (!detalle) {
        return (
            <div className="reporte-error">

                <h2>
                    No se encontró información
                </h2>

            </div>
        );
    }

    // ==========================================
    // REPORTE
    // ==========================================

    return (
        <div className="reporte-contenedor reporte-impresion">

            {/* =====================================
                ENCABEZADO
            ====================================== */}

            <div className="reporte-encabezado">

                <h1>
                    SALUDRÍA
                </h1>

                <h2>
                    Reporte de Atención Médica
                </h2>

                <p>
                    Sistema de Gestión de Citas Médicas
                </p>

            </div>


            {/* =====================================
                INFORMACIÓN DE LA CITA
            ====================================== */}

            <section className="reporte-seccion">

                <h3>
                    Información de la cita
                </h3>

                <div className="reporte-grid">

                    <div className="reporte-campo">

                        <strong>
                            Número de cita:
                        </strong>

                        <span>
                            {
                                cita?.id ||
                                detalle?.cita?.id ||
                                "No disponible"
                            }
                        </span>

                    </div>


                    <div className="reporte-campo">

                        <strong>
                            Especialidad:
                        </strong>

                        <span>
                            {
                                cita?.especialidad ||
                                detalle?.cita?.especialidad ||
                                "No disponible"
                            }
                        </span>

                    </div>


                    <div className="reporte-campo">

                        <strong>
                            Estado:
                        </strong>

                        <span>
                            {
                                cita?.estado ||
                                detalle?.cita?.estado ||
                                "No disponible"
                            }
                        </span>

                    </div>


                    <div className="reporte-campo">

                        <strong>
                            Fecha y hora:
                        </strong>

                        <span>
                            {
                                cita?.fechaHora ||
                                detalle?.cita?.fechaHora ||
                                "No disponible"
                            }
                        </span>

                    </div>

                </div>

            </section>


            {/* =====================================
                INFORMACIÓN DEL PACIENTE
            ====================================== */}

            <section className="reporte-seccion">

                <h3>
                    Información del paciente
                </h3>

                <div className="reporte-grid">

                    <div className="reporte-campo">

                        <strong>
                            Nombre:
                        </strong>

                        <span>
                            {
                                usuario?.nombre ||
                                "No disponible"
                            }
                        </span>

                    </div>


                    <div className="reporte-campo">

                        <strong>
                            Correo:
                        </strong>

                        <span>
                            {
                                usuario?.correo ||
                                "No disponible"
                            }
                        </span>

                    </div>

                </div>

            </section>


            {/* =====================================
                INFORMACIÓN DEL MÉDICO
            ====================================== */}

            <section className="reporte-seccion">

                <h3>
                    Información del médico
                </h3>

                <div className="reporte-grid">

                    <div className="reporte-campo">

                        <strong>
                            Nombre:
                        </strong>

                        <span>
                            {
                                medico?.nombre ||
                                "No disponible"
                            }
                        </span>

                    </div>


                    <div className="reporte-campo">

                        <strong>
                            Especialidad:
                        </strong>

                        <span>
                            {
                                medico?.especialidad ||
                                "No disponible"
                            }
                        </span>

                    </div>

                </div>

            </section>


            {/* =====================================
                DETALLE DE LA ATENCIÓN MÉDICA
            ====================================== */}

            <section className="reporte-seccion">

                <h3>
                    Detalle de la atención médica
                </h3>

                <div className="reporte-detalle">

                    <div className="reporte-campo-completo">

                        <strong>
                            Motivo de consulta:
                        </strong>

                        <p>
                            {
                                detalle.motivoConsulta ||
                                "No registrado"
                            }
                        </p>

                    </div>


                    <div className="reporte-campo-completo">

                        <strong>
                            Observaciones:
                        </strong>

                        <p>
                            {
                                detalle.observaciones ||
                                "No registradas"
                            }
                        </p>

                    </div>


                    <div className="reporte-campo-completo">

                        <strong>
                            Diagnóstico:
                        </strong>

                        <p>
                            {
                                detalle.diagnostico ||
                                "No registrado"
                            }
                        </p>

                    </div>


                    <div className="reporte-campo-completo">

                        <strong>
                            Tratamiento:
                        </strong>

                        <p>
                            {
                                detalle.tratamiento ||
                                "No registrado"
                            }
                        </p>

                    </div>


                    <div className="reporte-campo-completo">

                        <strong>
                            Estado de atención:
                        </strong>

                        <p>
                            {
                                detalle.estadoAtencion ||
                                "No registrado"
                            }
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================
                BOTONES
                NO SE IMPRIMEN
            ====================================== */}

            <div className="reporte-acciones no-imprimir">

                <button
                    className="boton-imprimir"
                    onClick={imprimirReporte}
                >
                    🖨️ Imprimir reporte
                </button>


                <button
                    className="boton-actualizar"
                    onClick={cargarReporte}
                >
                    🔄 Actualizar información
                </button>

            </div>


            {/* =====================================
                PIE DEL REPORTE
            ====================================== */}

            <footer className="reporte-pie">

                <p>
                    Saludría - Sistema de Gestión de Citas Médicas
                </p>

                <p>
                    Reporte generado desde el sistema
                </p>

                <p>
                    Proyecto ADSO - Integración de módulos
                </p>

            </footer>

        </div>
    );
}

export default ReporteDetalleCita;