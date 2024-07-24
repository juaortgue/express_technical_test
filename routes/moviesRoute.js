const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const controller = require('../controllers/moviesController');
const movieRouter = express.Router();

movieRouter.get('/',verifyToken,controller.getAllMovies)
movieRouter.post('/',verifyToken,controller.createMovie)
movieRouter.put('/:id',verifyToken,controller.updateMovie)
movieRouter.delete('/:id',verifyToken,controller.deleteMovie)



module.exports = movieRouter;
