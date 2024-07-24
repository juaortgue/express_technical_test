const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('mydatabase', 'root', 'Azucena2197*', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});


const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: false
});

const initialUsers = [
    { email: 'user1@example.com', password: 'password1' },
    { email: 'user2@example.com', password: 'password2' },
];

async function initializeDatabase() {
    try {
        await sequelize.sync({ force: false });
        const userCount = await User.count();
        if (userCount === 0) {
            await User.bulkCreate(initialUsers);
            console.log('Initial users created successfully');
        } else {
            console.log('Users already exist in the database. Skipping user initialization.');
        }
       
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initializeDatabase();

module.exports = {
    sequelize,
    User,
};
