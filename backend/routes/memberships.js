// =========================================================
// Membership Plan Routes - CRUD operations
// =========================================================
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all membership plans
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM memberships ORDER BY membership_id DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single plan
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM memberships WHERE membership_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Membership plan not found' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// CREATE a new plan
router.post('/', async (req, res) => {
    try {
        const { plan_name, duration_months, price, description } = req.body;

        if (!plan_name || !duration_months || !price) {
            return res.status(400).json({ success: false, message: 'Plan name, duration, and price are required' });
        }

        const [result] = await db.query(
            `INSERT INTO memberships (plan_name, duration_months, price, description) VALUES (?, ?, ?, ?)`,
            [plan_name, duration_months, price, description]
        );

        res.status(201).json({ success: true, message: 'Membership plan created', membership_id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// UPDATE a plan
router.put('/:id', async (req, res) => {
    try {
        const { plan_name, duration_months, price, description } = req.body;

        const [result] = await db.query(
            `UPDATE memberships SET plan_name=?, duration_months=?, price=?, description=? WHERE membership_id=?`,
            [plan_name, duration_months, price, description, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Membership plan not found' });
        }
        res.json({ success: true, message: 'Membership plan updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE a plan
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM memberships WHERE membership_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Membership plan not found' });
        }
        res.json({ success: true, message: 'Membership plan deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
