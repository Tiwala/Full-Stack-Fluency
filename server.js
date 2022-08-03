import express from 'express'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9696;

const dbConfig = {
    connectionString: process.env.DATABASE_URL
};

if (process.env.NODE_ENV === "production") {
    dbConfig.ssl = {
        rejectUnathorized: false
    };
}

const pool = new pg.Pool(dbConfig);

app.use(express.static("static"));

const unknownHTTP = (req, res, next) => {
    res.sendStatus(404);
}

const internalError = (err, req, res, next) => {
    res.status(500).send('Internal Server Error');
}

app.use(express.json());

app.get('/api/trainers', (req, res, next) => {
    pool.query('SELECT * FROM trainers').then((data) => {
        res.send(data.rows);
    }).catch(next);
})

app.get('/api/trainers/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query('SELECT * FROM trainers WHERE trainer_id = $1;', [id]).then((data) => {
        const trainer = data.rows[0];
        if (trainer) {
            res.send(trainer);
        } else {
            res.status(404);
            res.send(`The trainer at ID ${id} does not exist`);
        }
    })
})

app.get('/api/pokemon', (req, res, next) => {
    pool.query('SELECT * FROM pokemon').then((data) => {
        res.send(data.rows);
    }).catch(next);
})

app.get('/api/pokemon/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query('SELECT * FROM pokemon WHERE pokemon_id = $1', [id]).then((data) => {
        const pokemon = data.rows[0];
        if (pokemon) {
            res.send(pokemon);
        } else {
            res.status(404);
            res.send(`The pokemon at ID ${id} does not exist`);
        }
    })
})

app.post('/api/trainers', (req, res, next) => {
    const newTrainer = req.body;
    if (!newTrainer.name) {
        res.status(400);
        res.send('Bad Request');
    } else {
        pool.query(`INSERT INTO trainers (name) VALUES ($1) RETURNING *`, [newTrainer.name])
        .then((data) => {
            res.send(data.rows[0]);
        }).catch(next);
    }
})

app.post('/api/pokemon', (req, res, next) => {
    const newPokemon = req.body;
    if (!newPokemon.name || !newPokemon.trainer_id) {
        res.status(400);
        res.send('Bad Request');
    } else {
        pool.query(`INSERT INTO pokemon (name, trainer_id) VALUES ($1, $2) RETURNING *`, [newPokemon.name, newPokemon.trainer_id])
        .then((data) => {
            res.send(data.rows[0]);
        }).catch(next);
    }
})

app.patch('/api/trainers/:id', (req, res, next) => {
    const id = req.params.id;
    const trainerUpdate = req.body;
    if (!trainerUpdate.name) {
        res.status(400);
        res.send('Bad Request')
    } else {
        pool.query(`UPDATE trainers
        SET name = COALESCE($1, name)
        WHERE trainer_id = $2
        RETURNING *;`, [trainerUpdate.name, id])
        .then((data) => {
            if (data.rows.length === 0) {
                res.status(404);
                res.send(`The trainer at ID ${id} does not exist`);
            } else {
                res.send(data.rows[0]);
            }
        }).catch(next);
    }
})

app.patch('/api/pokemon/:id', (req, res, next) => {
    const id = req.params.id;
    const pokemonUpdate = req.body;
    if (!pokemonUpdate.name || !pokemonUpdate.trainer_id) {
        res.status(400);
        res.send('Bad Request')
    } else {
        pool.query(`UPDATE trainers
        SET name = COALESCE($1, name),
        trainer_id = COALESCE($2, trainer_id)
        WHERE pokemon_id = $3
        RETURNING *;`, [pokemonUpdate.name, pokemonUpdate.trainer_id, id])
        .then((data) => {
            if (data.rows.length === 0) {
                res.status(404);
                res.send(`The pokemon at ID ${id} does not exist`);
            } else {
                res.send(data.rows[0]);
            }
        }).catch(next);
    }
})

app.delete('/api/trainers/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query('DELETE FROM trainers WHERE trainer_id = $1 RETURNING *', [id])
    .then((data) => {
        if (data.rows[0] === undefined) {
            res.status(404);
            res.send(`The trainer at ID ${id} does not exist`);
        } else {
            res.send(data.rows[0])
        }
    }).catch(next);
})

app.delete('/api/pokemon/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query('DELETE FROM pokemon WHERE pokemon_id = $1 RETURNING *', [id])
    .then((data) => {
        if (data.rows[0] === undefined) {
            res.status(404);
            res.send(`The pokemon at ID ${id} does not exist`);
        } else {
            res.send(data.rows[0])
        }
    }).catch(next);
})


app.use(unknownHTTP);
app.use(internalError);

app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
});