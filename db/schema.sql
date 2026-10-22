CREATE TABLE IF NOT EXISTS genres (
  genre_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  genre_name varchar(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS publishers (
  publisher_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  publisher_name varchar(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title varchar(255) NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL CHECK (stock >= 0),
  image_url text,
  publisher_id integer REFERENCES publishers (publisher_id),
  release_year integer
);

-- A game can have many genres and a genre can belong to many games.
CREATE TABLE IF NOT EXISTS game_genres (
  game_id integer NOT NULL REFERENCES games (id) ON DELETE CASCADE,
  genre_id integer NOT NULL REFERENCES genres (genre_id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, genre_id)
);
