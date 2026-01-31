-- Add has_variants flag to pata_kits and pts_kits tables
ALTER TABLE pata_kits ADD COLUMN IF NOT EXISTS has_variants BOOLEAN DEFAULT false;
ALTER TABLE pts_kits ADD COLUMN IF NOT EXISTS has_variants BOOLEAN DEFAULT false;

-- Set has_variants to true for kits that should have variants
-- Based on the list: 402, 403, 404, 405, 406, 409, 502, 503, 504, 505, 506, 507, 508
UPDATE pata_kits 
SET has_variants = true 
WHERE code IN ('402', '403', '404', '405', '406', '409', '502', '503', '504', '505', '506', '507', '508');
