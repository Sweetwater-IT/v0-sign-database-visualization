-- Add description column to pts_kits if not exists
ALTER TABLE pts_kits ADD COLUMN IF NOT EXISTS description TEXT;

-- Add description column to pata_kits if not exists
ALTER TABLE pata_kits ADD COLUMN IF NOT EXISTS description TEXT;

-- Update PTS kit descriptions
UPDATE pts_kits SET description = 'Flagger Control with AFAD' WHERE code = 'PTS 001A';
UPDATE pts_kits SET description = 'Single-Lane Approach - No Roadway Encroachment' WHERE code = 'PTS 001B';
UPDATE pts_kits SET description = 'Temporary Work Stoppage' WHERE code = 'PTS 002A';

-- Update PATA kit descriptions from CSV data
UPDATE pata_kits SET description = 'Single-Lane Approach - No Roadway Encroachment' WHERE code = 'PATA 101-A';
UPDATE pata_kits SET description = 'Multi-Lane Approach - Right Shoulder Work - No Roadway Encroachment' WHERE code = 'PATA 101-B';
UPDATE pata_kits SET description = 'Multi-Lane Approach - Left Shoulder Work - No Roadway Encroachment' WHERE code = 'PATA 101-C';
UPDATE pata_kits SET description = 'Single-Lane Approach - Shoulder Work With Minor Roadway Encroachment' WHERE code = 'PATA 102';
UPDATE pata_kits SET description = 'Single Lane Approach - Shoulder Work With Major Roadway Encroachment' WHERE code = 'PATA 103';
UPDATE pata_kits SET description = 'Work Space on Roadway Center Line' WHERE code = 'PATA 104';
UPDATE pata_kits SET description = 'Work Space in the Center of an Intersection' WHERE code = 'PATA 105';
UPDATE pata_kits SET description = 'Work in Single-Lane and Center Line - Two Flaggers' WHERE code = 'PATA 106';
UPDATE pata_kits SET description = 'Work in One-Lane - Two Flaggers' WHERE code = 'PATA 107';
UPDATE pata_kits SET description = 'Work in Single-Lane - One Flagger' WHERE code = 'PATA 108';
