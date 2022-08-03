DROP TABLE IF EXISTS trainers CASCADE;
DROP TABLE IF EXISTS pokemon CASCADE;

CREATE TABLE trainers (
    trainer_id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE pokemon (
    pokemon_id SERIAL,
    name TEXT,
    trainer_id integer NOT NULL REFERENCES trainers (trainer_id) ON DELETE CASCADE
);

INSERT INTO trainers (name) VALUES ('gerard');
INSERT INTO trainers (name) VALUES ('randy');
INSERT INTO trainers (name) VALUES ('charles');

INSERT INTO pokemon (name, trainer_id) VALUES ('Umbreon', 1);
INSERT INTO pokemon (name, trainer_id) VALUES ('Jirachi', 1);
INSERT INTO pokemon (name, trainer_id) VALUES ('Vaporeon', 1);
INSERT INTO pokemon (name, trainer_id) VALUES ('Arcanine', 1);
INSERT INTO pokemon (name, trainer_id) VALUES ('Garbodor', 1);

INSERT INTO pokemon (name, trainer_id) VALUES ('Gardevoir', 3);
INSERT INTO pokemon (name, trainer_id) VALUES ('Flareon', 3);
INSERT INTO pokemon (name, trainer_id) VALUES ('Electabuzz', 3);
INSERT INTO pokemon (name, trainer_id) VALUES ('Glaceon', 3);
INSERT INTO pokemon (name, trainer_id) VALUES ('Gengar', 3);

INSERT INTO pokemon (name, trainer_id) VALUES ('Pikachu', 2);
INSERT INTO pokemon (name, trainer_id) VALUES ('Charizard', 2);
