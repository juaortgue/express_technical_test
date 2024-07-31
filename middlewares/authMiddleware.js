const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwt_secret';

function verifyToken(req, res, next) {
    
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Token not provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }

        req.user = decoded;
        next(); 
    });
}

module.exports = { verifyToken };