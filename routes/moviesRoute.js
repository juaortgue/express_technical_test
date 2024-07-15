
const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const db = require('../config/db');
const {createMovie,deleteMovie,updateMovie} = require('../controllers/moviesController');
const movieRouter = express.Router();

movieRouter.use(verifyToken);

movieRouter.get('/', (req, res) => {
    const userId = req.user.user_id; 
    let query = `
    SELECT m.*, GROUP_CONCAT(c.name) as category_names
    FROM movies m
    LEFT JOIN movie_categories mc ON m.id = mc.movie_id
    LEFT JOIN categories c ON mc.category_id = c.id
    WHERE m.user_id = ?
    GROUP BY m.id;
`;    const { name, category } = req.query;

    if (name) {
        query += 'AND m.name LIKE ?';
    }

    if (category) {
        query += 'AND c.name LIKE ?';
    }
    
    db.query(query, [userId,name,category], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error fetching movies', details: err });
        }
        res.status(200).json(results);
    });
});

movieRouter.post('/', verifyToken, (req, res) => {
    const { name, year_of_release, cover, categories } = req.body;
    const userId = req.user.user_id; 

    createMovie(name, year_of_release, cover, categories, userId, (err, movieId) => {
        if (err) {
            return res.status(500).json({ error: 'Error creating movie', details: err });
        }
        
        res.status(201).json({ message: 'Movie created successfully', movieId });
    });
});

movieRouter.put('/:movieId', (req, res) => {
    const movieId = req.params.movieId;
    const { name, year_of_release, cover, categories } = req.body;
    const userId = req.user.user_id;

    const checkMovieOwnerQuery = 'SELECT * FROM movies WHERE id = ? AND user_id = ?';

    db.query(checkMovieOwnerQuery, [movieId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error checking movie ownership', details: err });
        }
        if (results.length === 0) {
            return res.status(403).json({ error: 'You are not authorized to update this movie' });
        }

        updateMovie(movieId, name, year_of_release, cover, categories, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating movie', details: err });
            }

            res.status(200).json({ message: 'Movie updated successfully' });
        });
    });
});


movieRouter.delete('/:movieId', (req, res) => {
    const movieId = req.params.movieId;
    const userId = req.user.user_id; 

    const checkMovieOwnerQuery = 'SELECT * FROM movies WHERE id = ? AND user_id = ?';

    db.query(checkMovieOwnerQuery, [movieId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error checking movie ownership', details: err });
        }
        if (results.length === 0) {
            return res.status(403).json({ error: 'You are not authorized to delete this movie' });
        }

        deleteMovie(movieId, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error deleting movie', details: err });
            }

            res.status(200).json({ message: 'Movie deleted successfully' });
        });
    });
});

module.exports = movieRouter;
