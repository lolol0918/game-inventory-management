-- Many-to-many genres: a game can now belong to several genres.
--   * creates the game_genres junction table
--   * copies the genre of every game into the junction table
--   * drops the old games.genre_id column
-- The statements are written so they are safe to run on a database that has
-- already been migrated (the application database is already on this schema).

CREATE TABLE IF NOT EXISTS game_genres (
  game_id integer NOT NULL REFERENCES games (id) ON DELETE CASCADE,
  genre_id integer NOT NULL REFERENCES genres (genre_id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, genre_id)
);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'games' AND column_name = 'genre_id'
  ) THEN
    INSERT INTO game_genres (game_id, genre_id)
    SELECT id, genre_id
    FROM games
    WHERE genre_id IS NOT NULL
    ON CONFLICT (game_id, genre_id) DO NOTHING;
  END IF;
END $$;

ALTER TABLE games DROP COLUMN IF EXISTS genre_id;
