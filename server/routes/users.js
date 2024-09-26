// users.js
const express = require('express');
const db = require('../db');
const router = express.Router();
const runQuery = require('./helpers/runQuery'); // Use the helper for running queries

// Get all users
router.get('/', (req, res) => runQuery('SELECT * FROM users', [], res));

// Create a new user
router.post('/', (req, res) => {
    const { username, role } = req.body;
    runQuery('INSERT INTO users (username, role) VALUES (?, ?)', [username, role], res);
});

module.exports = router;
