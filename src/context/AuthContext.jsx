import React, {
    createContext,
    useContext,
    useState
} from "react";

import {
    login,
    guardarSesion,
    obtenerSesion,
    cerrarSesion
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(
        obtenerSesion()
    );

    const iniciarSesion = async (
        correo,
        password
    ) => {

        const data = await login(
            correo,
            password
        );

        guardarSesion(data);

        setUsuario(data);

        return data;
    };

    const salir = () => {

        cerrarSesion();

        setUsuario(null);
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                iniciarSesion,
                salir,
                autenticado: !!usuario
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}