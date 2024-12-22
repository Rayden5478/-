const express = require('express');
const createTables = require('./db/setup');
const pool = require('./db/index');

const UserRouter = require('./Routers/UserRouter');
const PostRouter = require('./Routers/PostRouter');  // Роутер для постов

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Маршруты
app.use('/api', UserRouter);  // Маршрут для пользователей
app.use('/api', PostRouter);  // Маршрут для постов

async function initializeApp() {
    try {
        // Создание таблиц в базе данных
        await createTables(pool);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error initializing app:', error.message);
    }
}

initializeApp();