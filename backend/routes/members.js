const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.*, mp.plan_name, t.name AS trainer_name
            FROM members m
            LEFT JOIN memberships mp ON m.membership_id = mp.membership_id
            LEFT JOIN trainers t ON m.trainer_id = t.trainer_id
            ORDER BY m.member_id DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM members WHERE member_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, phone, address, gender, dob, membership_id, trainer_id, status } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }

        const [result] = await db.query(
            `INSERT INTO members (name, email, phone, address, gender, dob, membership_id, trainer_id, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, phone, address, gender, dob, membership_id || null, trainer_id || null, status || 'Active']
        );

        res.status(201).json({ success: true, message: 'Member created successfully', member_id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, email, phone, address, gender, dob, membership_id, trainer_id, status } = req.body;

        const [result] = await db.query(
            `UPDATE members SET name=?, email=?, phone=?, address=?, gender=?, dob=?, membership_id=?, trainer_id=?, status=?
             WHERE member_id=?`,
            [name, email, phone, address, gender, dob, membership_id || null, trainer_id || null, status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }
        res.json({ success: true, message: 'Member updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM members WHERE member_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }
        res.json({ success: true, message: 'Member deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
