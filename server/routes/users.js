const express = require('express');
const db = require('../db');
const router = express.Router();
const runQuery = require('../helpers/runQuery'); // Use the helper for running queries

// Get all users
router.get('/', (req, res) => runQuery('SELECT * FROM users', [], res));

// Get a specific user by username
router.get('/:username', (req, res) => {
    const { username } = req.params;
    runQuery('SELECT * FROM users WHERE username = ?', [username], res);
});

// Create a new user
router.post('/', (req, res) => {
    const { username, password, role } = req.body; // Assuming password is handled securely
    runQuery('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role], res);
});

// Authenticate a user
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    runQuery('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = results[0];
        req.session.user = user; // Store user in session
        res.json(user);
    });
});

// Get the currently logged-in user (assuming you're using sessions)
router.get('/current', (req, res) => {
    console.log('GET /current called'); // Debugging log
    if (req.session && req.session.user) {
        console.log('User in session:', req.session.user); // Log session info
        res.json(req.session.user);
    } else {
        console.log('No user logged in');
        res.status(401).json({ message: 'No user is currently logged in' });
    }
});

module.exports = router;
