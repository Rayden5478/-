const pool = require('../config/database');

// Проверка доступности столика
const isTableAvailable = async (tableNumber, date, reservationId = null) => {
    const query = `
        SELECT * FROM reservations
        WHERE table_number = $1
        AND reservation_date = $2
        ${reservationId ? 'AND reservation_id != $3' : ''}
    `;
    const params = reservationId ? [tableNumber, date, reservationId] : [tableNumber, date];
    const result = await pool.query(query, params);
    return result.rows.length === 0;
};

// Добавление бронирования
const addReservation = async (customerName, tableNumber, date, partySize) => {
    const query = `
        INSERT INTO reservations (customer_name, table_number, reservation_date, party_size)
        VALUES ($1, $2, $3, $4) RETURNING *`;
    const params = [customerName, tableNumber, date, partySize];
    const result = await pool.query(query, params);
    return result.rows[0];
};

// Получение списка бронирований
const getAllReservations = async (date = null) => {
    let query = `SELECT * FROM reservations`;
    const params = [];

    if (date) {
        query += ` WHERE DATE(reservation_date) = $1`;
        params.push(date);
    }

    const result = await pool.query(query, params);
    return result.rows;
};

// Получение информации о бронировании
const getReservationById = async (reservationId) => {
    const query = `SELECT * FROM reservations WHERE reservation_id = $1`;
    const result = await pool.query(query, [reservationId]);
    return result.rows[0];
};

// Обновление бронирования
const updateReservation = async (reservationId, updates) => {
    const { customer_name, table_number, reservation_date, party_size } = updates;
    const query = `
        UPDATE reservations
        SET customer_name = COALESCE($1, customer_name),
            table_number = COALESCE($2, table_number),
            reservation_date = COALESCE($3, reservation_date),
            party_size = COALESCE($4, party_size)
        WHERE reservation_id = $5 RETURNING *`;
    const params = [customer_name, table_number, reservation_date, party_size, reservationId];
    const result = await pool.query(query, params);
    return result.rows[0];
};

// Удаление бронирования
const deleteReservation = async (reservationId) => {
    const query = `DELETE FROM reservations WHERE reservation_id = $1 RETURNING *`;
    const result = await pool.query(query, [reservationId]);
    return result.rows[0];
};

// Получение статуса столиков
const getTableStatuses = async (date) => {
    const tables = await pool.query(`SELECT * FROM tables`);
    const reservations = await pool.query(
        `SELECT table_number FROM reservations WHERE DATE(reservation_date) = $1`,
        [date]
    );

    const reservedTables = new Set(reservations.rows.map((row) => row.table_number));
    return tables.rows.map((table) => ({
        table_number: table.table_number,
        seats: table.seats,
        status: reservedTables.has(table.table_number) ? 'occupied' : 'free',
    }));
};

module.exports = {
    isTableAvailable,
    addReservation,
    getAllReservations,
    getReservationById,
    updateReservation,
    deleteReservation,
    getTableStatuses,
};
