let editIndex = null;

function guardarRegistro() {
    const datosPaciente = {
        nombre: document.getElementById("nombre").value,
        edad: document.getElementById("edad").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value,
        correo: document.getElementById("correo").value,
        familiar: {
            nombre: document.getElementById("nombre_familiar").value,
            edad: document.getElementById("edad_familiar").value,
            direccion: document.getElementById("direccion_familiar").value,
            telefono: document.getElementById("telefono_familiar").value
        },
        salud: {
            enfermedad: document.getElementById("enfermedad").value,
            tiempo: document.getElementById("tiempo_enfermedad").value,
            detalles: document.getElementById("detalles").value
        },
        internamiento: {
            centro: document.getElementById("centro_medico").value,
            fecha: document.getElementById("fecha_internamiento").value,
            diagnostico: document.getElementById("diagnostico").value
        }
    };

    fetch('/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosPaciente)
    }).then(response => response.text())
      .then(() => location.reload());
}

function verRegistros() {
    fetch('/obtener')
        .then(response => response.json())
        .then(data => {
            let html = data.map((registro, index) => `
                <div class="registro">
                    <p><strong>Nombre:</strong> ${registro.nombre}</p>
                    <p><strong>Edad:</strong> ${registro.edad}</p>
                    <p><strong>Teléfono:</strong> ${registro.telefono}</p>
                    <button onclick="eliminarRegistro(${index})">Eliminar</button>
                </div>
            `).join("");
            document.getElementById("registros").innerHTML = html;
        });
}

function eliminarRegistro(index) {
    fetch(`/eliminar/${index}`, { method: 'DELETE' })
        .then(() => verRegistros());
}
