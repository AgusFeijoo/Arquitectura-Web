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
        fechaCreacion: new Date().toISOString() // Nueva propiedad: fecha de creación
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

const port = 80;
app.listen(port, () => console.log(`Escuchando en puerto ${port}...`));
