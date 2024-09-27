const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // For hashing passwords
const router = express.Router();
const db = require('../db');

// JWT secret key
const JWT_SECRET = 'internship'; // Replace with a strong secret key

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Token:', token); // Add this line

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('JWT Error:', err); // Add this line
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log('User decoded from token:', user); // Add this line
        req.user = user;
        next();
    });
};



// Get all users
router.get('/', (req, res) => {
    db.query('SELECT * FROM users', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Get a specific user by username
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

// Create a new user with hashed password
router.post('/', async (req, res) => {
    const { username, password, role } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
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

// Authenticate a user and generate JWT
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials(results 0)' });
        }

        const user = results[0];
        console.log("From login: ",user);
        
        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials(password not match)' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role }, // Payload
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send token and user information as response
        res.json({ token, user });
    });
});

// Get the currently logged-in user (requires valid JWT)
router.get('/current', authenticateToken, (req, res) => {
    console.log('Authenticated User:', req.user); // Debugging log
    if (req.user) {
        return res.json({ user: req.user });
    }
    return res.status(404).json({ message: 'User not found' });
});


module.exports = router;
