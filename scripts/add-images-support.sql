-- Add image_url column to signs table for image storage
ALTER TABLE signs ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE signs ADD COLUMN IF NOT EXISTS image_uploaded_at TIMESTAMP;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_signs_image_url ON signs(image_url);
