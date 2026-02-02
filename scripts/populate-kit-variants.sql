-- Insert kit variants for PATA kits that have options
-- Store variant options for kits that have A/B options

-- Option A for kits 402, 403, 404, 405, 406, 409, 502, 503, 504, 505, 506, 507, 508
INSERT INTO kit_variants (kit_id, variant_label, description, finished, blights)
VALUES 
  (1, 'A', '402 - Option A', false, 0),
  (2, 'A', '403 - Option A', false, 0),
  (3, 'A', '404 - Option A', false, 0),
  (4, 'A', '405 - Option A', false, 0),
  (5, 'A', '406 - Option A', false, 0),
  (7, 'A', '409 - Option A', false, 0),
  (13, 'A', '502 - Option A', false, 0),
  (14, 'A', '503 - Option A', false, 0),
  (15, 'A', '504 - Option A', false, 0),
  (16, 'A', '505 - Option A', false, 0),
  (17, 'A', '506 - Option A', false, 0),
  (18, 'A', '507 - Option A', false, 0),
  (19, 'A', '508 - Option A', false, 0)
ON CONFLICT (kit_id, variant_label) DO NOTHING;

-- Option B for same kits
INSERT INTO kit_variants (kit_id, variant_label, description, finished, blights)
VALUES 
  (1, 'B', '402 - Option B', false, 0),
  (2, 'B', '403 - Option B', false, 0),
  (3, 'B', '404 - Option B', false, 0),
  (4, 'B', '405 - Option B', false, 0),
  (5, 'B', '406 - Option B', false, 0),
  (7, 'B', '409 - Option B', false, 0),
  (13, 'B', '502 - Option B', false, 0),
  (14, 'B', '503 - Option B', false, 0),
  (15, 'B', '504 - Option B', false, 0),
  (16, 'B', '505 - Option B', false, 0),
  (17, 'B', '506 - Option B', false, 0),
  (18, 'B', '507 - Option B', false, 0),
  (19, 'B', '508 - Option B', false, 0)
ON CONFLICT (kit_id, variant_label) DO NOTHING;
