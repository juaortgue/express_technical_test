const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    
    const CategoryModel = sequelize.define('Category',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        }
    });

    return CategoryModel;
};
