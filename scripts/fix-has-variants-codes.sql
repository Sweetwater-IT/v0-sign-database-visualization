-- Fix the has_variants flag - use correct kit codes with 'PATA ' prefix
UPDATE pata_kits 
SET has_variants = true 
WHERE code IN ('PATA 402', 'PATA 403', 'PATA 404', 'PATA 405', 'PATA 406', 'PATA 409', 'PATA 502', 'PATA 503', 'PATA 504', 'PATA 505', 'PATA 506', 'PATA 507', 'PATA 508');

UPDATE pts_kits 
SET has_variants = true 
WHERE code IN ('PTS 402', 'PTS 403', 'PTS 404', 'PTS 405', 'PTS 406', 'PTS 409', 'PTS 502', 'PTS 503', 'PTS 504', 'PTS 505', 'PTS 506', 'PTS 507', 'PTS 508');
