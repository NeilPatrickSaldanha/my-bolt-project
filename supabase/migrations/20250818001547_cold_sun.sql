/*
  # Add creator tracking to escape rooms

  1. Changes
    - Add `creator_id` column to `escape_rooms` table
    - Set up foreign key relationship to `auth.users`
    - Update RLS policies to respect ownership
    - Backfill existing rooms with a default creator (optional)

  2. Security
    - Users can only edit/delete their own rooms
    - All users can still view all rooms
    - Proper foreign key constraints
*/

-- Add creator_id column to escape_rooms table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'escape_rooms' AND column_name = 'creator_id'
  ) THEN
    ALTER TABLE escape_rooms ADD COLUMN creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update RLS policies for proper ownership
DROP POLICY IF EXISTS "Users can update their own rooms" ON escape_rooms;
DROP POLICY IF EXISTS "Users can delete their own rooms" ON escape_rooms;

-- Allow users to update only their own rooms
CREATE POLICY "Users can update their own rooms"
  ON escape_rooms
  FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Allow users to delete only their own rooms
CREATE POLICY "Users can delete their own rooms"
  ON escape_rooms
  FOR DELETE
  TO authenticated
  USING (creator_id = auth.uid());

-- Update insert policy to automatically set creator_id
DROP POLICY IF EXISTS "Users can insert escape rooms" ON escape_rooms;
CREATE POLICY "Users can insert escape rooms"
  ON escape_rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());