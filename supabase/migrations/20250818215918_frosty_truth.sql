/*
  # Fix Security Policies and Event Registration

  1. Security Fixes
    - Remove overly permissive DELETE policies on escape_rooms table
    - Ensure only room creators can delete their own rooms
    - Restrict UPDATE operations to room creators only

  2. Event Registration
    - Ensure proper policies for event_attendees table
    - Allow users to register/unregister for events
    - Allow room creators to view attendees of their rooms

  3. Policy Cleanup
    - Remove duplicate and conflicting policies
    - Establish clear, secure access patterns
*/

-- First, drop all existing policies on escape_rooms to start clean
DROP POLICY IF EXISTS "Anyone can read escape rooms" ON escape_rooms;
DROP POLICY IF EXISTS "Authenticated users can insert escape rooms" ON escape_rooms;
DROP POLICY IF EXISTS "Authenticated users can update escape rooms" ON escape_rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON escape_rooms;
DROP POLICY IF EXISTS "Enable read access for all users" ON escape_rooms;
DROP POLICY IF EXISTS "Users can insert escape rooms" ON escape_rooms;
DROP POLICY IF EXISTS "Users can update their own rooms" ON escape_rooms;

-- Create secure policies for escape_rooms
CREATE POLICY "Anyone can read escape rooms"
  ON escape_rooms
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create escape rooms"
  ON escape_rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Room creators can update their own rooms"
  ON escape_rooms
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Room creators can delete their own rooms"
  ON escape_rooms
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Ensure event_attendees policies are correct
DROP POLICY IF EXISTS "Users can insert their own attendee records" ON event_attendees;
DROP POLICY IF EXISTS "Users can read their own attendee records" ON event_attendees;
DROP POLICY IF EXISTS "Users can update their own attendee records" ON event_attendees;
DROP POLICY IF EXISTS "Users can delete their own attendee records" ON event_attendees;
DROP POLICY IF EXISTS "Room creators can read attendees of their rooms" ON event_attendees;

-- Create secure policies for event_attendees
CREATE POLICY "Users can register for events"
  ON event_attendees
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own registrations"
  ON event_attendees
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations"
  ON event_attendees
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own registrations"
  ON event_attendees
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Room creators can view attendees of their rooms"
  ON event_attendees
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM escape_rooms
      WHERE escape_rooms.id = event_attendees.escape_room_id
      AND escape_rooms.creator_id = auth.uid()
    )
  );

-- Ensure favorites policies are secure
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can read own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;

CREATE POLICY "Users can add favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);