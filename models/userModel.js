const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    
    const UserModel = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'users',
        timestamps: false
    });

    return UserModel;
};
