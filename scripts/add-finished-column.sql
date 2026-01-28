-- Add finished column to pata_kits table
ALTER TABLE pata_kits
ADD COLUMN finished BOOLEAN DEFAULT false;

-- Add finished column to pts_kits table
ALTER TABLE pts_kits
ADD COLUMN finished BOOLEAN DEFAULT false;
