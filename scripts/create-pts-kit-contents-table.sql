CREATE TABLE pts_kit_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pts_kit_code VARCHAR(255) NOT NULL,
  sign_designation VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(pts_kit_code, sign_designation)
);

CREATE INDEX idx_pts_kit_contents_code ON pts_kit_contents(pts_kit_code);
