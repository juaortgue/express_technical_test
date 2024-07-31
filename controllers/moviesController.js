const {sequelize} = require('../config/db');
const MovieModel = require('../models/movieModel')(sequelize);
const MovieCategoryModel = require('../models/movieCategoryModel')(sequelize);
const { Op } = require('sequelize');

const controller = {}

const isTokenProvided = (req,res)=>{

    if (!req.user || !req.user.id) {
        return res.status(403).json({ error: 'Token not provided or invalid' });
    }
}

controller.getAllMovies = async (req, res) => {

    const userId = req.user.id;

    const tokenValidationError = isTokenProvided(req, res);
    if (tokenValidationError) return tokenValidationError;

    const { name } = req.query; 

    try {

        const queryConditions = { where: { user_id: userId } };

        if (name) {
            
            queryConditions.where.name = {
                [Op.like]: `%${name}%` 
            };
        }

        const movies = await MovieModel.findAll(queryConditions);

        if (movies.length > 0) {
            res.status(200).json({ movies });
        } else {
            res.status(404).json({ error: 'No movies found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving movies from database', details: error.message });
    }
};


controller.updateMovie = async (req, res) => {

    const movieId = req.params.id; 
    const { name, year_of_release, cover, categories } = req.body;
    const userId = req.user.id;

    isTokenProvided(req,res)

    try {

        const movie = await MovieModel.findOne({ where: { id: movieId, user_id: userId } });

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found or not authorized to update' });
        }

        await MovieModel.update(
            { name, year_of_release, cover },
            { where: { id: movieId } }
        );

        await MovieCategoryModel.destroy({ where: { movie_id: movieId } });

        const categoryEntries = categories.map(categoryId => ({ movie_id: movieId, category_id: categoryId }));
        await MovieCategoryModel.bulkCreate(categoryEntries);

        res.status(200).json({ message: 'Movie updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating movie in database', details: error.message });
    }
};

controller.deleteMovie = async (req,res)=>{
    
    const userId = req.user.id;
    const movieId = req.params.id;

    isTokenProvided(req,res)

    try {

        const movie = await MovieModel.findOne({ where: { id: movieId, user_id: userId } });

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found or not authorized to delete' });
        }

        await MovieCategoryModel.destroy({ where: { movie_id: movieId } });

        await MovieModel.destroy({ where: { id: movieId } });

        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {

        res.status(500).json({ error: 'Error deleting movie from database', details: error.message });
    }
}

controller.createMovie = async (req,res)=>{

    const { name, year_of_release, cover, categories } = req.body;
     
    const userId = req.user.id

    isTokenProvided(req,res)

    try {

        const newMovie = await MovieModel.create({name:name, year_of_release:year_of_release, cover:cover, user_id:userId})

        if (newMovie) {
            console.log("categorias: ",categories);
            categories.forEach((category_id, index) => {
                MovieCategoryModel.create({movie_id:newMovie.id,category_id:category_id})
              });

            res.status(201).json({ message: 'Movie created successfully', movie: newMovie });

        } else {

            res.status(400).json({ error: 'Movie creation failed, no movie object returned' });
        }
    } catch (error) {

        res.status(500).json({ error: 'Error inserting movie into database', details: error });
    }
}

module.exports = controller