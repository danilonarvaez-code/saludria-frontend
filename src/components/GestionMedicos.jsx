import React, { useState, useEffect } from 'react';

const GestionMedicos = () => {
    const [medicos, setMedicos] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        especialidad: '',
        tarjetaProfesional: '',
        email: ''
    });
    
    const [idEditando, setIdEditando] = useState(null);
    const API_URL = 'http://localhost:8080/api/medicos';

    useEffect(() => {
        obtenerMedicos();
    }, []);

    const obtenerMedicos = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) {
                console.error("Error en la respuesta del servidor:", res.status);
                setMedicos([]);
                return;
            }
            const data = await res.json();
            if (Array.isArray(data)) {
                setMedicos(data);
            } else {
                setMedicos([]);
            }
        } catch (error) {
            console.error("Error al obtener médicos:", error);
            setMedicos([]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const esEdicion = idEditando !== null;
        const url = esEdicion ? `${API_URL}/${idEditando}` : API_URL;
        const metodo = esEdicion ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                limpiarFormulario();
                obtenerMedicos();
            } else {
                console.error("Error al guardar médico. Estado:", res.status);
            }
        } catch (error) {
            console.error("Error al conectar con la API:", error);
        }
    };

    const prepararEdicion = (medico) => {
        setIdEditando(medico.id);
        setFormData({
            nombre: medico.nombre,
            especialidad: medico.especialidad,
            tarjetaProfesional: medico.tarjetaProfesional,
            email: medico.email
        });
    };

    const limpiarFormulario = () => {
        setIdEditando(null);
        setFormData({ nombre: '', especialidad: '', tarjetaProfesional: '', email: '' });
    };

    const eliminarMedico = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este médico?")) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) obtenerMedicos();
        } catch (error) {
            console.error("Error al eliminar médico:", error);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2>Módulo de Gestión de Médicos</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre Completo"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="especialidad"
                    placeholder="Especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="tarjetaProfesional"
                    placeholder="Tarjeta Profesional"
                    value={formData.tarjetaProfesional}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Correo Electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        type="submit" 
                        style={{ 
                            flex: 1, 
                            backgroundColor: idEditando ? '#ffc107' : '#007bff', 
                            color: idEditando ? '#000' : '#fff',
                            border: 'none', 
                            padding: '10px', 
                            borderRadius: '4px',
                            cursor: 'pointer' 
                        }}
                    >
                        {idEditando ? 'Actualizar Médico' : 'Registrar Médico'}
                    </button>

                    {idEditando && (
                        <button 
                            type="button" 
                            onClick={limpiarFormulario}
                            style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <h3 style={{ marginTop: '30px' }}>Listado de Especialistas</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Array.isArray(medicos) && medicos.length > 0 ? (
                    medicos.map((medico) => (
                        <div 
                            key={medico.id} 
                            style={{ 
                                border: '1px solid #ddd', 
                                padding: '10px 15px', 
                                borderRadius: '5px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                            }}
                        >
                            <div style={{ textAlign: 'left' }}>
                                <strong>Dr(a). {medico.nombre}</strong> - {medico.especialidad}<br />
                                <small style={{ color: '#666' }}>TP: {medico.tarjetaProfesional} | {medico.email}</small>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button 
                                    onClick={() => prepararEdicion(medico)}
                                    style={{ backgroundColor: '#ffc107', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Editar
                                </button>

                                <button 
                                    onClick={() => eliminarMedico(medico.id)}
                                    style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#888' }}>No hay médicos registrados o no se pudo conectar con el servidor.</p>
                )}
            </div>
        </div>
    );
};

export default GestionMedicos;