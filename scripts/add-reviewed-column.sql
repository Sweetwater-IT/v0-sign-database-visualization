-- Add reviewed column to pata_kits and pts_kits tables
ALTER TABLE pata_kits ADD COLUMN IF NOT EXISTS reviewed BOOLEAN DEFAULT FALSE;
ALTER TABLE pts_kits ADD COLUMN IF NOT EXISTS reviewed BOOLEAN DEFAULT FALSE;