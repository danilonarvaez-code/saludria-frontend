import React, { useState, useEffect } from "react";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../services/usuarioService";

export const UsuarioPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    correo: "",
    password: "",
    rol: "ROLE_USER",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateUsuario(formData.id, formData);
      } else {
        await createUsuario(formData);
      }
      resetForm();
      cargarUsuarios();
    } catch (error) {
      alert("Ocurrió un error al guardar los datos");
    }
  };

  const handleEdit = (usuario) => {
    setFormData({ ...usuario, password: "" });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas eliminar este usuario?")) {
      await deleteUsuario(id);
      cargarUsuarios();
    }
  };

  const resetForm = () => {
    setFormData({ id: null, nombre: "", correo: "", password: "", rol: "ROLE_USER" });
    setEditMode(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Gestión de Usuarios</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "30px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre Completo"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo Electrónico"
          value={formData.correo}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder={editMode ? "Nueva contraseña (opcional)" : "Contraseña"}
          value={formData.password}
          onChange={handleChange}
          required={!editMode}
        />
        <select name="rol" value={formData.rol} onChange={handleChange}>
          <option value="ROLE_USER">Usuario</option>
          <option value="ROLE_ADMIN">Administrador</option>
        </select>

        <div>
          <button type="submit">{editMode ? "Actualizar" : "Guardar"}</button>
          {editMode && <button type="button" onClick={resetForm} style={{ marginLeft: "10px" }}>Cancelar</button>}
        </div>
      </form>

      {/* Tabla */}
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Editar</button>
                <button onClick={() => handleDelete(u.id)} style={{ marginLeft: "5px", color: "red" }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};