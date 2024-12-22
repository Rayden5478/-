const pool = require('../config/database');

// Функция для создания таблиц
const createTables = async () => {
    const tablesQuery = `
        CREATE TABLE IF NOT EXISTS tables (
            table_id SERIAL PRIMARY KEY,
            table_number INT UNIQUE NOT NULL,
            seats INT NOT NULL
        );
    `;

    const reservationsQuery = `
        CREATE TABLE IF NOT EXISTS reservations (
            reservation_id SERIAL PRIMARY KEY,
            customer_name VARCHAR(100) NOT NULL,
            table_number INT NOT NULL REFERENCES tables(table_number),
            reservation_date TIMESTAMP NOT NULL,
            party_size INT NOT NULL,
            UNIQUE (table_number, reservation_date)
        );
    `;

    try {
        console.log('Создаём таблицы...');
        await pool.query(tablesQuery);
        await pool.query(reservationsQuery);
        console.log('Таблицы успешно созданы.');
    } catch (err) {
        console.error('Ошибка при создании таблиц:', err);
    } finally {
        await pool.end();
    }
};

// Запуск функции
createTables();