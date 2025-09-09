/*
  # Fix Storage Policies for Image Upload

  1. Storage Bucket Setup
    - Create escape-room-images bucket if it doesn't exist
    - Make bucket public for reading images
  
  2. Storage Policies
    - Allow authenticated users to upload images
    - Allow public read access to images
    - Allow authenticated users to update/delete their uploads

  3. Security
    - Proper RLS policies for storage operations
    - Public read access for displaying images
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('escape-room-images', 'escape-room-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects;

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'escape-room-images');

-- Allow public read access to images
CREATE POLICY "Allow public read access to images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'escape-room-images');

-- Allow authenticated users to update images
CREATE POLICY "Allow authenticated users to update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'escape-room-images')
WITH CHECK (bucket_id = 'escape-room-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'escape-room-images');