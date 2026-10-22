-- Legacy migration: it only applies to databases that still have the old
-- games.genre_id column (before the many-to-many change, see
-- 002_game_genres_junction.sql). It is kept for reference and is skipped
-- automatically on databases that already use the game_genres junction table.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'games' AND column_name = 'genre_id'
  ) THEN
    ALTER TABLE games DROP CONSTRAINT IF EXISTS games_genre_id_fkey;

    ALTER TABLE games
      ADD CONSTRAINT games_genre_id_fkey
      FOREIGN KEY (genre_id) REFERENCES genres (genre_id)
      ON DELETE SET NULL;
  END IF;
END $$;
