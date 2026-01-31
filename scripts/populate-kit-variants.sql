-- Insert kit variants for PATA kits that have options
-- 402-A/B, 403-A/B, 404-A/B, 405-A/B, 406-A/B need variants
-- 407 stays as-is (no variants)
-- 408 stays as-is (no variants) 
-- 409-A/B need variants
-- 501-A/B stay as-is (no variants)
-- 502-A/B through 508-B need variants
-- 601 stays as-is (no variants)

-- First, for kits that need variants, create option A and B
INSERT INTO kit_variants (kit_id, variant_label, description, finished, blights)
SELECT pk.id, 'Option A' as variant_label, 'Option A - Work in Right Lane' as description, false, 0
FROM pata_kits pk
WHERE pk.code IN ('PATA 402', 'PATA 403', 'PATA 404', 'PATA 405', 'PATA 406', 'PATA 409', 'PATA 502', 'PATA 503', 'PATA 504', 'PATA 505', 'PATA 506', 'PATA 507', 'PATA 508')
ON CONFLICT (kit_id, variant_label) DO NOTHING;

INSERT INTO kit_variants (kit_id, variant_label, description, finished, blights)
SELECT pk.id, 'Option B' as variant_label, 'Option B - Work in Left Lane' as description, false, 0
FROM pata_kits pk
WHERE pk.code IN ('PATA 402', 'PATA 403', 'PATA 404', 'PATA 405', 'PATA 406', 'PATA 409', 'PATA 502', 'PATA 503', 'PATA 504', 'PATA 505', 'PATA 506', 'PATA 507', 'PATA 508')
ON CONFLICT (kit_id, variant_label) DO NOTHING;
