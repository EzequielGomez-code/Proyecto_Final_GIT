// URL base para la API
const API_URL = 'http://localhost:3000/api/registros';

// Referencias a elementos del DOM
const registroForm = document.getElementById('registroForm');
const tablaRegistros = document.getElementById('tablaRegistros');
const mensajeVacio = document.getElementById('mensaje-vacio');
const buscarInput = document.getElementById('buscar');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');

// Variables globales
let registros = [];
let registroEditando = null;

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, esError = false) {
    notificationText.textContent = mensaje;
    notification.classList.add('show');
    
    if (esError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Función para obtener todos los registros
async function obtenerRegistros() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Error al obtener los registros');
        }
        
        registros = await response.json();
        mostrarRegistros();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al obtener los registros del servidor', true);
    }
}

// Función para guardar un registro
async function guardarRegistro(evento) {
    evento.preventDefault();
    
    // Obtener datos del formulario
    const formData = new FormData(registroForm);
    const nuevoRegistro = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        fecha: formData.get('fecha')
    };
    
    try {
        let response;
        let mensaje;
        
        if (registroEditando) {
            // Actualizar registro existente
            response = await fetch(`${API_URL}/${registroEditando.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoRegistro)
            });
            
            mensaje = 'Registro actualizado correctamente';
        } else {
            // Crear nuevo registro
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoRegistro)
            });
            
            mensaje = 'Registro guardado correctamente';
        }
        
        if (!response.ok) {
            throw new Error('Error al guardar el registro');
        }
        
        // Resetear formulario y estado
        registroForm.reset();
        registroEditando = null;
        
        // Cambiar texto del botón de vuelta a "Guardar"
        document.querySelector('.btn-primary').innerHTML = '<i class="fas fa-save"></i> Guardar';
        
        // Actualizar lista de registros
        obtenerRegistros();
        mostrarNotificacion(mensaje);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al guardar el registro', true);
    }
}

// Función para eliminar un registro
async function eliminarRegistro(id) {
    if (confirm('¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Error al eliminar el registro');
            }
            
            // Actualizar lista de registros
            obtenerRegistros();
            mostrarNotificacion('Registro eliminado correctamente');
        } catch (error) {
            console.error('Error:', error);
            mostrarNotificacion('Error al eliminar el registro', true);
        }
    }
}

// Función para editar un registro
function editarRegistro(id) {
    // Encontrar el registro a editar
    const registro = registros.find(reg => reg.id == id);
    
    if (!registro) {
        mostrarNotificacion('Registro no encontrado', true);
        return;
    }
    
    // Llenar el formulario con los datos del registro
    document.getElementById('nombre').value = registro.nombre;
    document.getElementById('email').value = registro.email;
    document.getElementById('telefono').value = registro.telefono;
    document.getElementById('fecha').value = registro.fecha;
    
    // Cambiar el texto del botón
    document.querySelector('.btn-primary').innerHTML = '<i class="fas fa-edit"></i> Actualizar';
    
    // Guardar referencia al registro que se está editando
    registroEditando = registro;
    
    // Desplazarse al formulario
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// Función para mostrar registros en la tabla
function mostrarRegistros(filtro = '') {
    const tbody = tablaRegistros.querySelector('tbody');
    tbody.innerHTML = '';
    
    // Filtrar registros si hay un texto de búsqueda
    const registrosFiltrados = filtro 
        ? registros.filter(reg => 
            reg.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
            reg.email.toLowerCase().includes(filtro.toLowerCase()) ||
            reg.telefono.includes(filtro))
        : registros;
    
    if (registrosFiltrados.length === 0) {
        tbody.innerHTML = '';
        mensajeVacio.style.display = 'block';
        return;
    }
    
    mensajeVacio.style.display = 'none';
    
    registrosFiltrados.forEach(registro => {
        const tr = document.createElement('tr');
        
        // Formatear fecha para mostrarla mejor
        const fecha = new Date(registro.fecha).toLocaleDateString();
        
        tr.innerHTML = `
            <td>${registro.nombre}</td>
            <td>${registro.email}</td>
            <td>${registro.telefono}</td>
            <td>${fecha}</td>
            <td>
                <button class="btn-action edit" onclick="editarRegistro(${registro.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action delete" onclick="eliminarRegistro(${registro.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Event listeners
registroForm.addEventListener('submit', guardarRegistro);

buscarInput.addEventListener('input', (e) => {
    mostrarRegistros(e.target.value);
});

// Cargar registros al iniciar
document.addEventListener('DOMContentLoaded', obtenerRegistros); 