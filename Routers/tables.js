const express = require('express');
const router = express.Router();
const { getTableStatuses } = require('../db/queries');

// Получение статуса столиков
router.get('/status', async (req, res) => {
    try {
        const status = await getTableStatuses(req.query.date);
        res.send(status);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error.' });
    }
});

module.exports = router;