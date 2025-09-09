/*
  # Create Event Attendees Table

  1. New Tables
    - `event_attendees`
      - `id` (bigint, primary key, auto-increment)
      - `user_id` (uuid, foreign key to auth.users)
      - `escape_room_id` (bigint, foreign key to escape_rooms)
      - `attended_at` (timestamp with time zone, default now())
      - `status` (text, default 'registered')
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `event_attendees` table
    - Add policy for users to read their own attendee records
    - Add policy for users to insert their own attendee records
    - Add policy for users to update their own attendee records
    - Add policy for room creators to read attendees of their rooms

  3. Indexes
    - Index on user_id for faster user queries
    - Index on escape_room_id for faster room queries
    - Unique constraint on user_id + escape_room_id to prevent duplicate registrations

  4. Changes
    - Creates comprehensive attendee tracking system
    - Supports different attendance statuses (registered, attended, cancelled)
    - Prevents duplicate registrations with unique constraint
*/

-- Create event_attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL,
  escape_room_id bigint NOT NULL,
  attended_at timestamptz DEFAULT now(),
  status text DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, escape_room_id)
);

-- Add foreign key constraints
ALTER TABLE event_attendees 
ADD CONSTRAINT event_attendees_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE event_attendees 
ADD CONSTRAINT event_attendees_escape_room_id_fkey 
FOREIGN KEY (escape_room_id) REFERENCES escape_rooms(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_escape_room_id ON event_attendees(escape_room_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_status ON event_attendees(status);

-- Enable Row Level Security
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own attendee records"
  ON event_attendees
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attendee records"
  ON event_attendees
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attendee records"
  ON event_attendees
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own attendee records"
  ON event_attendees
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Room creators can read attendees of their rooms"
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