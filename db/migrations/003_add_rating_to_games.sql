-- Add rating to games
ALTER TABLE games
  ADD COLUMN IF NOT EXISTS rating numeric(2, 1) CHECK (rating >= 1 AND rating <= 10);
