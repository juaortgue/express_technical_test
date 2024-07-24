const express = require('express');
const bodyParser = require('body-parser');
const movieRouter = require('./routes/moviesRoute');
const authRouter = require('./routes/authRoute');

const app = express();

app.use(bodyParser.json());
app.use('/movies', movieRouter);
app.use('/', authRouter);
app.use('/movies', movieRouter);


const PORT = 3000;

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running,and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
);