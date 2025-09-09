/*
  # Allow Anonymous Users to Create Escape Rooms

  1. Security Changes
    - Add RLS policy to allow anonymous users to insert escape rooms
    - Maintain existing policies for authenticated users
    - Keep read access open for all users

  This allows the application to create escape rooms without requiring user authentication.
*/

-- Allow anonymous users to insert escape rooms
CREATE POLICY "Allow anonymous users to create escape rooms"
  ON escape_rooms
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update escape rooms (for editing functionality)
CREATE POLICY "Allow anonymous users to update escape rooms"
  ON escape_rooms
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete escape rooms
CREATE POLICY "Allow anonymous users to delete escape rooms"
  ON escape_rooms
  FOR DELETE
  TO anon
  USING (true);