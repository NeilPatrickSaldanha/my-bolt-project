/*
  # Create favorites table for user favorite escape rooms

  1. New Tables
    - `favorites`
      - `id` (bigint, primary key)
      - `user_id` (uuid, references auth.users)
      - `escape_room_id` (bigint, references escape_rooms)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `favorites` table
    - Add policy for users to read their own favorites
    - Add policy for users to insert their own favorites
    - Add policy for users to delete their own favorites

  3. Constraints
    - Unique constraint on user_id + escape_room_id to prevent duplicates
*/

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  escape_room_id bigint NOT NULL REFERENCES escape_rooms(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, escape_room_id)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_escape_room_id ON favorites(escape_room_id);