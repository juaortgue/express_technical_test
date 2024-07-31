const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mydatabase', 'root', 'Azucena2197*', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

const initializeDatabase = require('./initialData');

initializeDatabase(sequelize);


module.exports = {
    sequelize
};
