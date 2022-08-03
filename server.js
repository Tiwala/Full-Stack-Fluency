import express from 'express'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 6969;

const dbconfig = {
    connectionString: process.env.DATABASE_URL
};

if (process.env.NODE_ENV === "production") {
    dbconfig.ssl = {
        rejectUnathorized: false
    };
};

const pool = new pg.Pool(dbConfig);

app.use(express.static("static"));
app.use(express.json());

const unknownHTTP = (req, res, next) => {
    res.sendStatus(404);
}

const internalError = (err, req, res, next) => {
    res.status(500).send('Internal Server Error');
}

app.use(express.json());

app.get('/api/trainers', (req, res, next) => {
    pool.query('SELECT * FROM trainers;').then((data) => {
        res.send(data.rows);
    }).catch(next);
})

app.get('/api/trainers/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query('SELECT * FROM trainers WHERE id = $1 RETURNING *;', [id]).then((data) => {
        const trainer = data.rows[0];
        if (trainer) {
            res.send(trainer);
        } else {
            res.status(404);
            res.send(`The trainer at ID ${id} does not exist`);
        }
    })
})

app.post('/api/trainers/', (req, res, next) => {
    
})

app.use(unknownHTTP);
app.use(internalError);

app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
});