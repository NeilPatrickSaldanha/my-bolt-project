/*
  # Update escape rooms policies for edit and delete operations

  1. Security Updates
    - Add UPDATE policy for authenticated users
    - Add DELETE policy for authenticated users
    - Ensure users can modify escape room records

  2. Policies
    - Allow authenticated users to update any escape room
    - Allow authenticated users to delete any escape room
    - Maintain existing SELECT and INSERT policies
*/

-- Update policy for escape rooms (allow authenticated users to update)
DROP POLICY IF EXISTS "Authenticated users can update escape rooms" ON escape_rooms;
CREATE POLICY "Authenticated users can update escape rooms"
  ON escape_rooms
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Delete policy for escape rooms (allow authenticated users to delete)
DROP POLICY IF EXISTS "Authenticated users can delete escape rooms" ON escape_rooms;
CREATE POLICY "Authenticated users can delete escape rooms"
  ON escape_rooms
  FOR DELETE
  TO authenticated
  USING (true);