const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    
    const UserModel = require('./userModel')(sequelize)

    const MovieModel = sequelize.define('Movie', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        year_of_release: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        cover: {
            type: DataTypes.STRING,
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: UserModel,
                key: 'id'
            }
        },
        creation_date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW
        },
        update_date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        tableName: 'movies',
        timestamps: false,
         indexes: [
            {
                unique: true,
                fields: ['name', 'user_id']
            }
        ]
    });

    return MovieModel;
};
