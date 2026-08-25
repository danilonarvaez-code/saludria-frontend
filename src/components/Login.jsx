import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import RegistroUsuario from "./RegistroUsuario";

export default function Login() {

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    const { iniciarSesion } = useAuth();

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        try {

            await iniciarSesion(correo, password);

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Credenciales inválidas o error en el servidor."
            );
        }
    };

    // =========================================
    // PANTALLA DE REGISTRO
    // =========================================

    if (mostrarRegistro) {

        return (
            <div style={styles.container}>

                <div style={styles.registerContainer}>

                    <RegistroUsuario />

                    <button
                        type="button"
                        onClick={() => {
                            setMostrarRegistro(false);
                            setError("");
                        }}
                        style={styles.backButton}
                    >
                        ← Volver al inicio de sesión
                    </button>

                </div>

            </div>
        );
    }

    // =========================================
    // PANTALLA DE LOGIN
    // =========================================

    return (
        <div style={styles.container}>

            <form
                onSubmit={handleSubmit}
                style={styles.form}
            >

                <h1 style={styles.title}>
                    Saludría
                </h1>

                <h2 style={styles.subtitle}>
                    Iniciar Sesión
                </h2>

                <p style={styles.description}>
                    Sistema de Gestión de Citas Médicas
                </p>

                {error && (
                    <p style={styles.error}>
                        {error}
                    </p>
                )}

                <div style={styles.inputGroup}>

                    <label>
                        Correo electrónico
                    </label>

                    <input
                        type="email"
                        value={correo}
                        onChange={(e) =>
                            setCorreo(e.target.value)
                        }
                        placeholder="admin@saludria.com"
                        required
                        style={styles.input}
                    />

                </div>

                <div style={styles.inputGroup}>

                    <label>
                        Contraseña
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Ingrese su contraseña"
                        required
                        style={styles.input}
                    />

                </div>

                <button
                    type="submit"
                    style={styles.button}
                >
                    Ingresar
                </button>

                <div style={styles.divider}>
                    <span>¿No tienes una cuenta?</span>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setMostrarRegistro(true);
                        setError("");
                    }}
                    style={styles.registerButton}
                >
                    Registrarme como paciente
                </button>

            </form>

        </div>
    );
}

const styles = {

    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        padding: "20px",
        boxSizing: "border-box"
    },

    form: {
        backgroundColor: "white",
        padding: "35px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
        width: "100%",
        maxWidth: "420px",
        boxSizing: "border-box"
    },

    registerContainer: {
        width: "100%",
        maxWidth: "550px"
    },

    title: {
        textAlign: "center",
        color: "#007bff",
        marginBottom: "5px"
    },

    subtitle: {
        textAlign: "center",
        marginBottom: "5px"
    },

    description: {
        textAlign: "center",
        color: "#666",
        marginBottom: "25px"
    },

    inputGroup: {
        marginBottom: "18px",
        display: "flex",
        flexDirection: "column"
    },

    input: {
        padding: "12px",
        marginTop: "6px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "15px",
        boxSizing: "border-box"
    },

    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer"
    },

    divider: {
        textAlign: "center",
        margin: "25px 0 15px",
        color: "#666"
    },

    registerButton: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "15px",
        cursor: "pointer"
    },

    backButton: {
        width: "100%",
        padding: "12px",
        marginTop: "15px",
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "15px",
        cursor: "pointer"
    },

    error: {
        color: "#721c24",
        backgroundColor: "#f8d7da",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "15px"
    }
};