-- First, create the kit_variants table without the foreign key initially
CREATE TABLE IF NOT EXISTS kit_variants (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  kit_id BIGINT NOT NULL,
  variant_label TEXT NOT NULL,
  description TEXT,
  finished BOOLEAN DEFAULT FALSE,
  blights INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(kit_id, variant_label)
);

CREATE INDEX IF NOT EXISTS idx_kit_variants_kit_id ON kit_variants(kit_id);

-- Add the kit_variant_id column to pata_kit_contents
ALTER TABLE pata_kit_contents 
ADD COLUMN IF NOT EXISTS kit_variant_id BIGINT;

-- Create the pts_kit_variants table
CREATE TABLE IF NOT EXISTS pts_kit_variants (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  kit_id BIGINT NOT NULL,
  variant_label TEXT NOT NULL,
  description TEXT,
  finished BOOLEAN DEFAULT FALSE,
  blights INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(kit_id, variant_label)
);

CREATE INDEX IF NOT EXISTS idx_pts_kit_variants_kit_id ON pts_kit_variants(kit_id);

-- Add the kit_variant_id column to pts_kit_contents
ALTER TABLE pts_kit_contents
ADD COLUMN IF NOT EXISTS kit_variant_id BIGINT;
