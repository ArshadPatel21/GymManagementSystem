// =========================================================
// Attendance Routes - Track member gym check-ins
// =========================================================
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all attendance records (joined with member name)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, m.name AS member_name
            FROM attendance a
            JOIN members m ON a.member_id = m.member_id
            ORDER BY a.date DESC, a.attendance_id DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET attendance for a specific member
router.get('/member/:memberId', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM attendance WHERE member_id = ? ORDER BY date DESC',
            [req.params.memberId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// CREATE (mark) attendance
router.post('/', async (req, res) => {
    try {
        const { member_id, date, check_in_time, status } = req.body;

        if (!member_id || !date) {
            return res.status(400).json({ success: false, message: 'Member ID and date are required' });
        }

        const [result] = await db.query(
            `INSERT INTO attendance (member_id, date, check_in_time, status) VALUES (?, ?, ?, ?)`,
            [member_id, date, check_in_time || null, status || 'Present']
        );

        res.status(201).json({ success: true, message: 'Attendance marked successfully', attendance_id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// UPDATE attendance record
router.put('/:id', async (req, res) => {
    try {
        const { date, check_in_time, status } = req.body;

        const [result] = await db.query(
            `UPDATE attendance SET date=?, check_in_time=?, status=? WHERE attendance_id=?`,
            [date, check_in_time, status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Attendance record not found' });
        }
        res.json({ success: true, message: 'Attendance updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE attendance record
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM attendance WHERE attendance_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Attendance record not found' });
        }
        res.json({ success: true, message: 'Attendance record deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
