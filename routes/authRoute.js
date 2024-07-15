const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwt_secret';
const express = require('express');
const db = require('../config/db');

const authRouter = express.Router();


function generateToken(user) {
    const payload = {
        email: user.email,
        user_id: user.user_id
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

authRouter.post('/register', (req, res) => {
    const { email, password } = req.body;

    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(query, [email, password], (err, results) => {

        if (err) {
            return res.status(500).json({ error: 'Error inserting user into database', details: err });
        }
        
        const userId = results.insertId;
        const token = generateToken({ email, user_id: userId });
        res.status(201).json({ message: 'User registered successfully', token });
    });
});

authRouter.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error during login', details: err });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
        const token = generateToken({ email: user.email, user_id: user.user_id });

        res.status(200).json({ message: 'Login successful', token });
    });
});

module.exports = authRouter;