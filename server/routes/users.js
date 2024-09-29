const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const db = require('../db');

const JWT_SECRET = 'internship';

router.get('/', (req, res) => {
    db.query('SELECT * FROM users', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

router.get('/:username', (req, res) => {
    const { username } = req.params;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

router.post('/', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database query failed' });
            }
            res.json({ message: 'User created successfully' });
        });
    } catch (error) {
        console.error('Hashing error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user });
    });
});

router.put('/:id', (req, res) => {
    const { role } = req.body;
    db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'User role updated successfully' });
    });
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'User deleted successfully' });
    });
});

router.get('/current', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});


module.exports = router;
