const mysql = require('mysql');

const categories = [
    'Horror',
    'Thriller',
    'Romance',
    'Action',
    'Fantasy',
    'Comedy',
    'Adventure',
    'Drama'
];

function createTables() {
    // Consulta para crear la tabla 'users'
    const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `;

    db.query(createUserTableQuery, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table created successfully');
        }
    });

    const createMoviesTableQuery = `
        CREATE TABLE IF NOT EXISTS movies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            year_of_release YEAR,
            cover VARCHAR(255),
            user_id INT,
            creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_movie (id, name),
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    `;

    db.query(createMoviesTableQuery, (err) => {
        if (err) {
            console.error('Error creating movies table:', err);
        } else {
            console.log('Movies table created successfully');
        }
    });

    const createCategoriesTableQuery = `
    CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )
`;

    db.query(createCategoriesTableQuery, (err) => {
        if (err) {
            console.error('Error creating categories table:', err);
        } else {
            console.log('Categories table created successfully');
        }
    });

    const createMovieCategoriesTableQuery = `
        CREATE TABLE IF NOT EXISTS movie_categories (
            movie_id INT,
            category_id INT,
            PRIMARY KEY (movie_id, category_id),
            FOREIGN KEY (movie_id) REFERENCES movies(id),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
    `;

    db.query(createMovieCategoriesTableQuery, (err) => {
        if (err) {
            console.error('Error creating movie_categories table:', err);
        } else {
            console.log('Movie categories table created successfully');
        }
    });

}

function initializeCategories() {
    const checkQuery = 'SELECT COUNT(*) as count FROM categories';

    db.query(checkQuery, (err, results) => {
        if (err) {
            console.error('Error checking categories table:', err);
            return;
        }

        const rowCount = results[0].count;

        if (rowCount === 0) {
            const insertQuery = 'INSERT INTO categories (name) VALUES ?';
            const values = categories.map(category => [category]);

            db.query(insertQuery, [values], (err, results) => {
                if (err) {
                    console.error('Error inserting categories into database:', err);
                } else {
                    console.log('Categories initialized successfully');
                }
            });
        } else {
            console.log('Categories already exist in the database. Skipping initialization.');
        }
    });
}

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Azucena2197*',
    database: 'mydatabase',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to MySQL');
        createTables();
        initializeCategories();
    }
});

module.exports = db;