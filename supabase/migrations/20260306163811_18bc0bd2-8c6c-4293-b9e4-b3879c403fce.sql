
-- Create storage bucket for radiesthesia graph images
INSERT INTO storage.buckets (id, name, public)
VALUES ('radiestesia-graphs', 'radiestesia-graphs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read images (public bucket)
CREATE POLICY "Public read access for radiestesia graphs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'radiestesia-graphs');

-- Allow authenticated users to upload images (for admin/owner to upload)
CREATE POLICY "Authenticated users can upload radiestesia graphs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'radiestesia-graphs');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update radiestesia graphs"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'radiestesia-graphs');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete radiestesia graphs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'radiestesia-graphs');
