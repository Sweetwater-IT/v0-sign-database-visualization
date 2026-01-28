-- Add PTS prefix to PTS kit codes
UPDATE pts_kits 
SET code = 'PTS ' || code 
WHERE code NOT LIKE 'PTS %';

-- Add PATA prefix to PATA kit codes
UPDATE pata_kits 
SET code = 'PATA ' || code 
WHERE code NOT LIKE 'PATA %';
