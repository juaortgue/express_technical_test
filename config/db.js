const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('mydatabase', 'root', 'Azucena2197*', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

//models 

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: false
});

const Category = sequelize.define('Category',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    }
})

const Movie = sequelize.define('Movie', {
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
            model: User,
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

const MovieCategory = sequelize.define('MovieCategory', {
    movie_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Movie,
            key: 'id'
        }
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id'
        }
    }
}, {
    tableName: 'movie_categories',
    timestamps: false
});

//relationships

Movie.belongsTo(User,{foreignKey:'user_id'})
Movie.belongsToMany(Category, { through: MovieCategory, foreignKey: 'movie_id' });
Category.belongsToMany(Movie, { through: MovieCategory, foreignKey: 'category_id' });

//initial data

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



async function initializeDatabase() {
    try {
        await sequelize.sync({ force: false });

        const categoryCount = await Category.count();
        if (categoryCount === 0) {
            await Category.bulkCreate(initialCategories);
            console.log('Initial categories created successfully');
        } else {
            console.log('Categories already exist in the database. Skipping category initialization.');
        }

        const userCount = await User.count();
        if (userCount === 0) {
            await User.bulkCreate(initialUsers);
            console.log('Initial users created successfully');
        } else {
            console.log('Users already exist in the database. Skipping user initialization.');
        }

        const movieCount = await Movie.count();
        if (movieCount==0) {
            await Movie.bulkCreate(initialMovies);
            console.log('Initial movies created successfully');
        }else{
            console.log('movies already exist in the database. Skipping movie initialization.');
        }
        
        const movieCategoryCount = await MovieCategory.count();
        if (movieCategoryCount==0) {
            await MovieCategory.bulkCreate(initialMoviesCategories);
            console.log('Initial movies_categories created successfully');
        }else{
            console.log('movies_categories already exist in the database. Skipping movies_categories initialization.');
        }
       
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initializeDatabase();

module.exports = {
    sequelize,
    User,
    Movie,
    Category,
    MovieCategory
};
