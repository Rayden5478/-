const express = require('express');
const router = express.Router();
const {
    isTableAvailable,
    addReservation,
    getAllReservations,
    getReservationById,
    updateReservation,
    deleteReservation,
} = require('../db/queries');

// Создание бронирования
router.post('/', async (req, res) => {
    const { customer_name, table_number, date, party_size } = req.body;

    try {
        if (!(await isTableAvailable(table_number, date))) {
            return res.status(400).send({ error: 'Table is already reserved for this time.' });
        }
        const reservation = await addReservation(customer_name, table_number, date, party_size);
        res.status(201).send(reservation);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error.' });
    }
});

// Получение списка всех бронирований
router.get('/', async (req, res) => {
    try {
        const reservations = await getAllReservations(req.query.date);
        res.send(reservations);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error.' });
    }
});

// Получение информации о конкретном бронировании
router.get('/:id', async (req, res) => {
    try {
        const reservation = await getReservationById(req.params.id);
        if (!reservation) return res.status(404).send({ error: 'Reservation not found.' });
        res.send(reservation);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error.' });
    }
});

// Обновление бронирования
router.put('/:id', async (req, res) => {
    try {
        const reservation = await updateReservation(req.params.id, req.body);
        res.send(reservation);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error.' });
    }
});

// Удаление бронирования
router.delete('/:id', async (req, res) => {
    try {
        const reservation = await deleteReservation(req.params.id);
        res.send({ message: 'Reservation deleted successfully.', reservation });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error.' });
    }
});

module.exports = router;
