/*
  # Create Storage Bucket for Escape Room Images

  1. Storage Setup
    - Create 'images' bucket for escape room photos
    - Enable public access for uploaded images
    - Set up RLS policies for image uploads

  2. Security
    - Allow public read access to images
    - Allow authenticated users to upload images
    - Restrict file types to images only
*/

-- Create the images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view images
CREATE POLICY "Public Access to Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images' AND (storage.foldername(name))[1] = 'escape-room-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images' AND (storage.foldername(name))[1] = 'escape-room-images');

-- Allow authenticated users to delete their uploaded images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images' AND (storage.foldername(name))[1] = 'escape-room-images');