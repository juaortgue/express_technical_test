const initialUsers = [
    { id:1, email: 'user1@example.com', password: 'password1' },
    { id:2, email: 'user2@example.com', password: 'password2' },
];

const initialCategories = [
    {id:1,name:"Horror"},
    {id:2,name:"Comedy"},
    {id:3,name:'Adventure'},
    {id:4,name:'Fantasy'}
]

const initialMovies = [
    { name: 'Deadpool 1', year_of_release:2012, cover:"example.jpg",user_id:1},
    { name: 'Deadpool 2', year_of_release:2016, cover:"example2.jpg",user_id:1},
    { name: 'El señor de los anillos', year_of_release:2008, cover:"example3.jpg",user_id:2},
];

const initialMoviesCategories = [
    {category_id:1,movie_id:1},
    {category_id:2,movie_id:1},
    {category_id:2,movie_id:2},
    {category_id:3,movie_id:3},
]

function createRelationships(MovieModel,UserModel,CategoryModel,MovieCategoryModel){

    MovieModel.belongsTo(UserModel,{foreignKey:'user_id'})
    MovieModel.belongsToMany(CategoryModel, { through: MovieCategoryModel, foreignKey: 'movie_id' });
    CategoryModel.belongsToMany(MovieModel, { through: MovieCategoryModel, foreignKey: 'category_id' });
}

async function initializeDatabase (sequelize){

    const UserModel = require('../models/userModel')(sequelize);
    const CategoryModel = require('../models/categoryModel')(sequelize);
    const MovieModel = require('../models/movieModel')(sequelize);
    const MovieCategoryModel = require('../models/movieCategoryModel')(sequelize);
    
    createRelationships(MovieModel,UserModel,CategoryModel,MovieCategoryModel);

    try {
        await sequelize.sync({ force: false });

        const categoryCount = await CategoryModel.count();
        if (categoryCount === 0) {
            await CategoryModel.bulkCreate(initialCategories);
            console.log('Initial categories created successfully');
        } else {
            console.log('Categories already exist in the database. Skipping category initialization.');
        }

        const userCount = await UserModel.count();
        if (userCount === 0) {
            await UserModel.bulkCreate(initialUsers);
            console.log('Initial users created successfully');
        } else {
            console.log('Users already exist in the database. Skipping user initialization.');
        }

        const movieCount = await MovieModel.count();
        if (movieCount==0) {
            await MovieModel.bulkCreate(initialMovies);
            console.log('Initial movies created successfully');
        }else{
            console.log('movies already exist in the database. Skipping movie initialization.');
        }
        
        const movieCategoryCount = await MovieCategoryModel.count();
        if (movieCategoryCount==0) {
            await MovieCategoryModel.bulkCreate(initialMoviesCategories);
            console.log('Initial movies_categories created successfully');
        }else{
            console.log('movies_categories already exist in the database. Skipping movies_categories initialization.');
        }
       
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}


module.exports = initializeDatabase
