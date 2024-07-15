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
        initializeCategories();
    }
});

module.exports = db;