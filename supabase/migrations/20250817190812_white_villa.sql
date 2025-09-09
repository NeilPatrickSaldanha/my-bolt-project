/*
  # Allow Anonymous Storage Upload

  1. Storage Policies
    - Allow anonymous users to upload images to escape-room-images bucket
    - Allow public read access to images
    - Allow anonymous users to update/delete their uploads

  2. Security Notes
    - This allows any visitor to upload images
    - Consider implementing authentication for production use
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Allow public read access to images
CREATE POLICY "Public read access"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'escape-room-images');

-- Allow anonymous users to upload images
CREATE POLICY "Anonymous users can upload images"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'escape-room-images');

-- Allow anonymous users to update images
CREATE POLICY "Anonymous users can update images"
  ON storage.objects
  FOR UPDATE
  TO anon
  USING (bucket_id = 'escape-room-images')
  WITH CHECK (bucket_id = 'escape-room-images');

-- Allow anonymous users to delete images
CREATE POLICY "Anonymous users can delete images"
  ON storage.objects
  FOR DELETE
  TO anon
  USING (bucket_id = 'escape-room-images');

-- Also allow authenticated users to perform all operations
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'escape-room-images');

CREATE POLICY "Authenticated users can update images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'escape-room-images')
  WITH CHECK (bucket_id = 'escape-room-images');

CREATE POLICY "Authenticated users can delete images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'escape-room-images');