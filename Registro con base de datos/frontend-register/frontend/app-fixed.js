// Clave para almacenar los registros
const STORAGE_KEY = 'registro_db_datos';

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

// Datos iniciales de ejemplo (simulando un JSON cargado)
const datosIniciales = [
    {
        id: 1,
        nombre: "Juan Pérez",
        email: "juan@ejemplo.com",
        telefono: "809-555-1234",
        fecha: "2023-05-15"
    },
    {
        id: 2,
        nombre: "María Rodríguez",
        email: "maria@ejemplo.com",
        telefono: "809-555-5678",
        fecha: "2023-06-20"
    }
];

// Función para obtener los registros
function obtenerRegistros() {
    // Usamos datos en memoria o los cargamos desde localStorage como respaldo
    try {
        const datosGuardados = localStorage.getItem(STORAGE_KEY);
        
        if (datosGuardados) {
            registros = JSON.parse(datosGuardados);
        } else {
            // Si no hay datos guardados, usar los iniciales
            registros = [...datosIniciales];
            // Guardamos en localStorage para futuras cargas
            localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
        }
        
        mostrarRegistros();
        // No mostramos notificación al cargar para evitar confusiones
    } catch (error) {
        console.error('Error al cargar datos:', error);
        // En caso de error, usar los datos iniciales
        registros = [...datosIniciales];
        mostrarRegistros();
    }
}

// Función para guardar un registro
function guardarRegistro(evento) {
    evento.preventDefault();
    
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const fecha = document.getElementById('fecha').value;
    
    // Validar datos
    if (!nombre || !email || !telefono || !fecha) {
        mostrarNotificacion('Por favor, complete todos los campos', true);
        return;
    }
    
    // Crear objeto de registro
    const nuevoRegistro = {
        nombre,
        email,
        telefono,
        fecha
    };
    
    try {
        let mensaje;
        
        if (registroEditando) {
            // Actualizar registro existente
            const indice = registros.findIndex(reg => reg.id === registroEditando.id);
            
            if (indice !== -1) {
                // Mantener el ID original
                nuevoRegistro.id = registroEditando.id;
                registros[indice] = nuevoRegistro;
            }
            
            mensaje = 'Registro actualizado correctamente';
        } else {
            // Crear nuevo registro con ID único
            nuevoRegistro.id = Date.now();
            registros.push(nuevoRegistro);
            
            mensaje = 'Registro guardado correctamente';
        }
        
        // Guardar en localStorage como respaldo
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
        
        // Resetear formulario y estado
        registroForm.reset();
        registroEditando = null;
        
        // Cambiar texto del botón de vuelta a "Guardar"
        document.querySelector('.btn-primary').innerHTML = '<i class="fas fa-save"></i> Guardar';
        
        // Actualizar lista de registros
        mostrarRegistros();
        mostrarNotificacion(mensaje);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Por favor, intente nuevamente', true);
    }
}

// Función para eliminar un registro
function eliminarRegistro(id) {
    if (confirm('¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.')) {
        try {
            // Filtrar el registro a eliminar
            registros = registros.filter(reg => reg.id !== id);
            
            // Guardar en localStorage como respaldo
            localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
            
            // Actualizar lista de registros
            mostrarRegistros();
            mostrarNotificacion('Registro eliminado correctamente');
        } catch (error) {
            console.error('Error:', error);
            mostrarNotificacion('Error al eliminar', true);
        }
    }
}

// Función para editar un registro
function editarRegistro(id) {
    // Encontrar el registro a editar
    const registro = registros.find(reg => reg.id === id);
    
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
        let fecha;
        try {
            fecha = new Date(registro.fecha).toLocaleDateString();
        } catch (e) {
            fecha = registro.fecha;
        }
        
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