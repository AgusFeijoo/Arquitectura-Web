
// Función para cargar y mostrar reservas
async function cargarReservas() {
    const response = await fetch('/api/reservas');
    const reservas = await response.json();
    mostrarReservas(reservas);
}

// Función para mostrar reservas en una tabla
async function mostrarReservas(reservas) {
    const reservasContainer = document.getElementById('reservas-container');
    reservasContainer.innerHTML = '';

    const table = document.createElement('table');
    const header = document.createElement('tr');
    header.innerHTML = `
        <th>Nombre</th>
        <th>Departamento</th>
        <th>Fecha de Entrada</th>
        <th>Fecha de Salida</th>
        <th>Fecha de Creación</th> <!-- Nueva columna -->
        <th>Valor por Noche</th>
        <th>Cantidad de Días</th>
        <th>Precio Total</th>
        <th>Acciones</th>
    `;
    table.appendChild(header);

    reservas.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));

    for (const reserva of reservas) {
        const departamentoResponse = await fetch(`/api/departamentos/${reserva.departamentoId}`);
        const departamento = await departamentoResponse.json();

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reserva.nombre}</td>
            <td>${departamento ? departamento.name : 'Desconocido'}</td>
            <td>${reserva.fechaInicio}</td>
            <td>${reserva.fechaFin}</td>
            <td>${reserva.fechaCreacion}</td> <!-- Mostrar fecha de creación -->
            <td>${reserva.valorPorNoche || 'N/A'}</td>
            <td>${reserva.cantidadDias || 'N/A'}</td>
            <td>${reserva.precioTotal || 'N/A'}</td>
        `;

        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.onclick = () => eliminarReserva(reserva.id);
        
        const accionesCell = document.createElement('td');
        accionesCell.appendChild(eliminarBtn);
        row.appendChild(accionesCell);

        table.appendChild(row);
    }

    reservasContainer.appendChild(table);
}

// Función para eliminar reserva con confirmación
async function eliminarReserva(id) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta reserva?');
    if (confirmacion) {
        const response = await fetch(`/api/reservas/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Reserva eliminada exitosamente');
            cargarReservas(); // Recargar reservas después de eliminar
        } else {
            alert('Error al eliminar la reserva');
        }
    }
}

// Función para crear una nueva reserva
async function crearReserva() {
    const nombre = document.getElementById('nombreInput').value;
    const departamentoId = document.getElementById('departamentoSelect').value;
    const fechaInicio = document.getElementById('fechaInicioInput').value;
    const fechaFin = document.getElementById('fechaFinInput').value;
    const valorPorNoche = document.getElementById('valorPorNocheInput').value;

    const nuevaReserva = {
        nombre,
        departamentoId,
        fechaInicio,
        fechaFin,
        valorPorNoche
    };

    const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaReserva)
    });

    if (response.ok) {
        alert('Reserva creada exitosamente');
        cargarReservas(); // Recargar reservas para mostrar la nueva reserva
    } else {
        alert('Error al crear la reserva');
    }
}

// Llama a estas funciones cuando se cargue la página
window.onload = () => {
    seleccionarFechaActual();
    cargarReservas();
};
