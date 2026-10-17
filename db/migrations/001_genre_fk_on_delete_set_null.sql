-- Applies the db/schema.sql change for databases created before
-- games.genre_id gained ON DELETE SET NULL. Data is untouched:
-- this only replaces the foreign-key constraint definition.

ALTER TABLE games DROP CONSTRAINT IF EXISTS games_genre_id_fkey;

ALTER TABLE games
  ADD CONSTRAINT games_genre_id_fkey
  FOREIGN KEY (genre_id) REFERENCES genres (genre_id)
  ON DELETE SET NULL;
