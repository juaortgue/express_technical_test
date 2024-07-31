const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwt_secret';
const {sequelize} = require('../config/db');
const UserModel = require('../models/userModel')(sequelize);
const controller = {}

function generateToken(user) {
    
    const payload = {
        email: user.email,
        id: user.id
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

controller.register = async (req, res) => {

    const { email, password } = req.body;

    try {
        const newUser = await UserModel.create({ email, password });
        
        const token = generateToken({ email: newUser.email, id: newUser.id });
        res.status(201).json({ message: 'User registered successfully', token });
        
    } catch (err) {
        console.error('Error inserting user into database:', err);
        res.status(500).json({ error: 'Error inserting user into database', details: err });
    }
}

controller.login = async (req,res)=>{
    
    const {email,password } = req.body;

    try {

        const user = await UserModel.findOne({ where: { email: email, password: password } })

        if (user==null) {
            return res.status(401).json({error: 'Invalid email or password'})
        }else{
            const token = generateToken({ email: user.email, id: user.id });
            res.status(200).json({ message: 'Login successful', token});
            
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Database error during login', details: error });
    }
}


module.exports = controller