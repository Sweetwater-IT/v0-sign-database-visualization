-- Create kit_variants table to store options for each kit
CREATE TABLE IF NOT EXISTS kit_variants (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  kit_id BIGINT NOT NULL REFERENCES pata_kits(id) ON DELETE CASCADE,
  variant_label TEXT NOT NULL, -- "A", "B", etc.
  description TEXT,
  finished BOOLEAN DEFAULT FALSE,
  blights INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_kit_variants_kit_id ON kit_variants(kit_id);

-- Update pata_kit_contents to reference variants instead of kits
ALTER TABLE pata_kit_contents 
ADD COLUMN IF NOT EXISTS kit_variant_id BIGINT REFERENCES kit_variants(id) ON DELETE CASCADE;

-- Same for PTS kits
CREATE TABLE IF NOT EXISTS pts_kit_variants (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  kit_id BIGINT NOT NULL REFERENCES pts_kits(id) ON DELETE CASCADE,
  variant_label TEXT NOT NULL,
  description TEXT,
  finished BOOLEAN DEFAULT FALSE,
  blights INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pts_kit_variants_kit_id ON pts_kit_variants(kit_id);

ALTER TABLE pts_kit_contents
ADD COLUMN IF NOT EXISTS kit_variant_id BIGINT REFERENCES pts_kit_variants(id) ON DELETE CASCADE;
