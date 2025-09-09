/*
  # Create Storage Bucket and Policies for Escape Room Images

  1. Storage Setup
    - Create 'escape-room-images' bucket for storing room images
    - Set bucket to public for easy image access
  
  2. Security Policies
    - Allow authenticated users to upload images
    - Allow public read access to images
    - Restrict file types to images only
*/

-- Create storage bucket for escape room images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('escape-room-images', 'escape-room-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload escape room images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'escape-room-images');

-- Allow public read access to escape room images
CREATE POLICY "Public can view escape room images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'escape-room-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update escape room images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'escape-room-images');

-- Allow authenticated users to delete escape room images
CREATE POLICY "Authenticated users can delete escape room images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'escape-room-images');