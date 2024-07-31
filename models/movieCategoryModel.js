const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    
    const MovieModel = require('./movieModel')(sequelize)
    const CategoryModel = require('./categoryModel')(sequelize)

    const MovieCategoryModel = sequelize.define('MovieCategory', {
        movie_id: {
            type: DataTypes.INTEGER,
            references: {
                model: MovieModel,
                key: 'id'
            }
        },
        category_id: {
            type: DataTypes.INTEGER,
            references: {
                model: CategoryModel,
                key: 'id'
            }
        }
    }, {
        tableName: 'movie_categories',
        timestamps: false
    });
    

    return MovieCategoryModel;
};
