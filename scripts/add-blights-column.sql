-- Add blights column to pata_kits and pts_kits tables
ALTER TABLE pata_kits ADD COLUMN IF NOT EXISTS blights INTEGER DEFAULT 0;
ALTER TABLE pts_kits ADD COLUMN IF NOT EXISTS blights INTEGER DEFAULT 0;
