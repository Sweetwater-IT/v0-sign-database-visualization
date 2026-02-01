-- Add team_check column to track team verification
ALTER TABLE pata_kits ADD COLUMN team_check BOOLEAN DEFAULT FALSE;
ALTER TABLE pts_kits ADD COLUMN team_check BOOLEAN DEFAULT FALSE;
