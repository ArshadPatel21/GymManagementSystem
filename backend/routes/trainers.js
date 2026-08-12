const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM trainers ORDER BY trainer_id DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM trainers WHERE trainer_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Trainer not found' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, phone, specialization, salary, joining_date } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }

        const [result] = await db.query(
            `INSERT INTO trainers (name, email, phone, specialization, salary, joining_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, phone, specialization, salary, joining_date]
        );

        res.status(201).json({ success: true, message: 'Trainer created successfully', trainer_id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, email, phone, specialization, salary, joining_date } = req.body;

        const [result] = await db.query(
            `UPDATE trainers SET name=?, email=?, phone=?, specialization=?, salary=?, joining_date=?
             WHERE trainer_id=?`,
            [name, email, phone, specialization, salary, joining_date, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Trainer not found' });
        }
        res.json({ success: true, message: 'Trainer updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM trainers WHERE trainer_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Trainer not found' });
        }
        res.json({ success: true, message: 'Trainer deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
