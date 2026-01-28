-- Create signs table
CREATE TABLE IF NOT EXISTS signs (
  id TEXT PRIMARY KEY,
  designation TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  sizes TEXT[] NOT NULL,
  sheeting TEXT NOT NULL,
  kits TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create kits table
CREATE TABLE IF NOT EXISTS kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  kit_type TEXT NOT NULL CHECK (kit_type IN ('PATA', 'PTS')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create kit_items table (junction table for signs in kits)
CREATE TABLE IF NOT EXISTS kit_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id UUID NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  sign_id TEXT NOT NULL REFERENCES signs(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(kit_id, sign_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_signs_category ON signs(category);
CREATE INDEX IF NOT EXISTS idx_signs_kits ON signs USING GIN(kits);
CREATE INDEX IF NOT EXISTS idx_kit_items_kit_id ON kit_items(kit_id);
CREATE INDEX IF NOT EXISTS idx_kit_items_sign_id ON kit_items(sign_id);
CREATE INDEX IF NOT EXISTS idx_kits_type ON kits(kit_type);
