const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, m.name AS member_name
            FROM payments p
            JOIN members m ON p.member_id = m.member_id
            ORDER BY p.payment_date DESC, p.payment_id DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/member/:memberId', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM payments WHERE member_id = ? ORDER BY payment_date DESC',
            [req.params.memberId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { member_id, amount, payment_date, payment_method, status } = req.body;

        if (!member_id || !amount) {
            return res.status(400).json({ success: false, message: 'Member ID and amount are required' });
        }

        const [result] = await db.query(
            `INSERT INTO payments (member_id, amount, payment_date, payment_method, status)
             VALUES (?, ?, ?, ?, ?)`,
            [member_id, amount, payment_date, payment_method || 'Cash', status || 'Paid']
        );

        res.status(201).json({ success: true, message: 'Payment recorded successfully', payment_id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { amount, payment_date, payment_method, status } = req.body;

        const [result] = await db.query(
            `UPDATE payments SET amount=?, payment_date=?, payment_method=?, status=? WHERE payment_id=?`,
            [amount, payment_date, payment_method, status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Payment record not found' });
        }
        res.json({ success: true, message: 'Payment updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM payments WHERE payment_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Payment record not found' });
        }
        res.json({ success: true, message: 'Payment record deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
