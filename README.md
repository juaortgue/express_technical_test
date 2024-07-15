# Express and NodeJS Test

This project is a simple demonstration of building a RESTful API using Express.js and Node.js. It includes basic CRUD operations for managing movies, authentication using JWT tokens, and integration with a MySQL database.

## Features

- Authentication: JWT-based authentication for user registration and login.
- Movies Endpoint: CRUD operations for managing movies associated with authenticated users.
- Filtering: Filtering movies by name and category name.
- Database: Integration with MySQL database using mysql package.

## Requirements

- Node.js
- MySQL
- express
- jsonwebtoken

## Installation

1. git clone [https://github.com/your/repository.git](https://github.com/juaortgue/express_technical_test.git)
2. cd repository
3. npm install
4. Create a MySQL database and adjust the configuration in config/db.js.
5. node .\app.js

## API Endpoint

### Authentication

- POST /register: Register a new user.
- - Body: { "email": "user@example.com", "password": "password" }
- POST /login: Login with existing credentials.
- - Body: { "email": "user@example.com", "password": "password" }

### Movies
- GET /movies: Retrieve all movies for the authenticated user.
- - Query Parameters:
  - - name: Filter movies by name.
    - category: Filter movies by category name.
- POST /movies: Create a new movie for the authenticated user.
- - Body: { "name": "Movie Name", "year_of_release": 2023, "cover": "http://example.com/cover.jpg", "categories": ["1", "5"] }
- PUT /movies: Update an existing movie by ID for the authenticated user.
- - Body: { "name": "Updated Movie Name", "year_of_release": 2024, "cover": "http://example.com/updated.jpg", "categories": [1,4] }
- DELETE /movies : Delete a movie by ID for the authenticated user.

All of these endpoints require an authorization token passed through the headers.







