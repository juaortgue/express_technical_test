const db = require('../config/db');

function createMovie(name, year_of_release, cover, categories, userId, callback) {
    const query = 'INSERT INTO movies (name, year_of_release, cover, user_id, creation_date, update_date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
    
    db.query(query, [name, year_of_release, cover, userId], (err, result) => {
        if (err) {
            console.error('Error inserting movie into database:', err);
            return callback(err);
        }

        const movieId = result.insertId; 

        const categoryInsertQuery = 'INSERT INTO movie_categories (movie_id, category_id) VALUES ?';
        const categoryValues = categories.map(categoryId => [movieId, categoryId]);

        db.query(categoryInsertQuery, [categoryValues], (err) => {
            if (err) {
                console.error('Error inserting movie categories into database:', err);
                return callback(err);
            }

            console.log('Movie created successfully');
            callback(null, movieId);
        });
    });
}

function deleteMovie(movieId, callback) {
    const deleteCategoriesQuery = 'DELETE FROM movie_categories WHERE movie_id = ?';
    const deleteMovieQuery = 'DELETE FROM movies WHERE id = ?';

    db.query(deleteCategoriesQuery, [movieId], (err) => {
        if (err) {
            console.error('Error deleting movie categories from database:', err);
            return callback(err);
        }

        db.query(deleteMovieQuery, [movieId], (err) => {
            if (err) {
                console.error('Error deleting movie from database:', err);
                return callback(err);
            }

            console.log('Movie deleted successfully');
            callback(null);
        });
    });
}

function updateMovie(movieId, name, year_of_release, cover, categories, callback) {
    const updateMovieQuery = 'UPDATE movies SET name = ?, year_of_release = ?, cover = ?, update_date = CURRENT_TIMESTAMP WHERE id = ?';
    
    db.query(updateMovieQuery, [name, year_of_release, cover, movieId], (err) => {
        if (err) {
            console.error('Error updating movie in database:', err);
            return callback(err);
        }

        const deleteCategoriesQuery = 'DELETE FROM movie_categories WHERE movie_id = ?';
        db.query(deleteCategoriesQuery, [movieId], (err) => {
            if (err) {
                console.error('Error deleting old movie categories from database:', err);
                return callback(err);
            }

            const categoryInsertQuery = 'INSERT INTO movie_categories (movie_id, category_id) VALUES ?';
            const categoryValues = categories.map(categoryId => [movieId, categoryId]);

            db.query(categoryInsertQuery, [categoryValues], (err) => {
                if (err) {
                    console.error('Error inserting new movie categories into database:', err);
                    return callback(err);
                }

                console.log('Movie updated successfully');
                callback(null);
            });
        });
    });
}

module.exports = {
    createMovie,
    deleteMovie,
    updateMovie
};
