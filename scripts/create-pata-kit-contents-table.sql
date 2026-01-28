CREATE TABLE pata_kit_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pata_kit_code VARCHAR(255) NOT NULL,
  sign_designation VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 0,
  blight_quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(pata_kit_code, sign_designation)
);

CREATE INDEX idx_pata_kit_contents_code ON pata_kit_contents(pata_kit_code);
