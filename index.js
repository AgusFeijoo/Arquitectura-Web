const express = require('express'); 
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const departamentos = [
    { id: 1, name: 'Departamento N° 1' },
    { id: 2, name: 'Departamento N° 2' },
    { id: 3, name: 'Departamento N° 3' },
];

const reservas = [];

// COMPROBAR QUE FUNCIONE LA API
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MUESTRA TODOS LOS DEPARTAMENTOS
app.get('/api/departamentos', (req, res) => {
    res.send(departamentos);
});

// BUSCAR UN DEPARTAMENTO EN PARTICULAR
app.get('/api/departamentos/:id', (req, res) => {
    const departamento = departamentos.find(c => c.id === parseInt(req.params.id));
    if (!departamento) return res.status(404).send('El departamento no existe');
    res.send(departamento);
});

// CREAR UNA NUEVA RESERVA
app.post('/api/reservas', (req, res) => {
    const { nombre, departamentoId, fechaInicio, fechaFin, valorPorNoche } = req.body;

    const departamento = departamentos.find(d => d.id === parseInt(departamentoId));
    if (!departamento) {
        return res.status(404).send('El departamento no existe');
    }

    const cantidadDias = Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24));

    const nuevaReserva = {
        id: reservas.length + 1,
        nombre,
        departamentoId,
        fechaInicio,
        fechaFin,
        valorPorNoche,
        cantidadDias,
        precioTotal: valorPorNoche * cantidadDias,
        fechaReserva: new Date().toISOString() // Nueva propiedad: fecha de creación
    };

    reservas.push(nuevaReserva);
    res.status(201).send(nuevaReserva);
});

// OBTENER TODAS LAS RESERVAS
app.get('/api/reservas', (req, res) => {
    res.send(reservas);
});

// ELIMINAR UNA RESERVA
app.delete('/api/reservas/:id', (req, res) => {
    const reserva = reservas.find(r => r.id === parseInt(req.params.id));
    if (!reserva) return res.status(404).send('La reserva no existe');

    const index = reservas.indexOf(reserva);
    reservas.splice(index, 1);
    res.send(reserva);
});

// ELIMINAR UN DEPARTAMENTO
app.delete('/api/departamentos/:id', (req, res) => {
    const departamento = departamentos.find(d => d.id === parseInt(req.params.id));
    if (!departamento) return res.status(404).send('El departamento no existe');

    const index = departamentos.indexOf(departamento);
    departamentos.splice(index, 1);
    res.send(departamento);
});

// CREAR UN NUEVO DEPARTAMENTO
app.post('/api/departamentos', (req, res) => {
    const { name } = req.body;

    const nuevoDepartamento = {
        id: departamentos.length + 1,
        name
    };

    departamentos.push(nuevoDepartamento);
    res.status(201).send(nuevoDepartamento);
});

// NUEVOS ENDPOINTS

// 1. Obtener todas las reservas con detalles del departamento
app.get('/api/reservas/detalles', (req, res) => {
    const reservasConDetalles = reservas.map(reserva => {
        const departamento = departamentos.find(d => d.id === reserva.departamentoId);
        return {
            ...reserva,
            departamento: departamento ? { id: departamento.id, name: departamento.name } : null
        };
    });
    res.send(reservasConDetalles);
});

// 2. Obtener todas las reservas de un departamento específico
app.get('/api/departamentos/:id/reservas', (req, res) => {
    console.log(reservas)
    const departamentoId = parseInt(req.params.id);
    const reservasDepartamento = reservas.filter(reserva => parseInt(reserva.departamentoId) === departamentoId);

    if (reservasDepartamento.length === 0) {
        return res.status(404).send('No hay reservas para este departamento o el departamento no existe');
    }

    res.send(reservasDepartamento);
    
});

// 3. Verificar disponibilidad de un departamento en un rango de fechas
app.get('/api/departamentos/:id/disponibilidad', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    const departamentoId = parseInt(req.params.id);

    if (!fechaInicio || !fechaFin) {
        return res.status(400).send('Debe proporcionar fechas de inicio y fin');
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        return res.status(400).send('Formato de fecha inválido');
    }

    const reservasDepartamento = reservas.filter(reserva => parseInt(reserva.departamentoId) === departamentoId);

    const disponible = reservasDepartamento.every(reserva => {
        const inicioReserva = new Date(reserva.fechaInicio);
        const finReserva = new Date(reserva.fechaFin);

        return (fin < inicioReserva || inicio > finReserva);
    });

    return res.send({ departamentoId, disponible });
});

// 4. Obtener ingresos totales por departamento
app.get('/api/departamentos/ingresos', (req, res) => {
    const ingresos = departamentos.map(departamento => {
        const reservasDepartamento = reservas.filter(reserva => reserva.departamentoId === departamento.id);
        const totalIngresos = reservasDepartamento.reduce((total, reserva) => total + reserva.precioTotal, 0);

        return {
            departamentoId: departamento.id,
            name: departamento.name,
            ingresosTotales: totalIngresos
        };
    });

    res.send(ingresos);
});

// 5. Obtener disponibilidad y próximas reservas de todos los departamentos
app.get('/api/departamentos/disponibilidad-general', (req, res) => {
    const disponibilidad = departamentos.map(departamento => {
        const reservasFuturas = reservas.filter(reserva => reserva.departamentoId === departamento.id && new Date(reserva.fechaInicio) > new Date());
        
        return {
            departamentoId: departamento.id,
            name: departamento.name,
            tieneReservasFuturas: reservasFuturas.length > 0,
            reservasFuturas: reservasFuturas.map(r => ({
                id: r.id,
                nombre: r.nombre,
                fechaInicio: r.fechaInicio,
                fechaFin: r.fechaFin,
                precioTotal: r.precioTotal
            }))
        };
    });

    res.send(disponibilidad);
});

const port = 80;
app.listen(port, () => console.log(`Escuchando en puerto ${port}...`));
