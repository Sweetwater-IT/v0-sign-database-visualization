-- Clear existing PATA kit contents to avoid duplicates
DELETE FROM pata_kit_contents;

-- Now load ALL PATA kits from the complete CSV data (lines 1-165 from PATA CSV)
-- PATA 100 Series
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 101-A', 'W20-1', 5);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 101-A', 'R2-1', 4);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 101-A', 'G20-2', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 101-B', 'W20-1', 6);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 101-B', 'R2-1', 4);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 101-B', 'G20-2', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 101-C', 'W20-1', 4);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 101-C', 'R2-1', 4);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 101-C', 'G20-2', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 102', 'W20-1', 5);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 102', 'R2-1', 3);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 103', 'W20-1', 8);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 103', 'R2-1', 3);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 104', 'W20-1', 4);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 104', 'R2-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 105', 'R2-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 106', 'R2-1', 4);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 106', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 107', 'W8-11', 2);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 107', 'R2-1', 3);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 108', 'W8-11', 1);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 108', 'R2-1', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 111', 'W8-11', 1);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 111', 'R2-1', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 117', 'W8-11', 2);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 117', 'R2-1', 3);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 118', 'W20-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 120', 'W20-1', 8);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 120', 'R2-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 121', 'W20-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 122', 'W20-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 131', 'R2-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 132', 'R2-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 133', 'R2-1', 4);

-- PATA 200 Series
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 201-A', 'W20-1', 5);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 201-A', 'G20-2', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 201-B', 'W20-1', 6);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 201-B', 'G20-2', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 201-C', 'W20-1', 4);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 201-C', 'G20-2', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 202-A', 'W20-1', 5);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 202-B', 'W20-1', 6);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 202-C', 'W20-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 203', 'W20-1', 8);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 203', 'R2-1', 3);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 204', 'W20-1', 4);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 204', 'R2-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 205', 'W8-11', 1);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 205', 'R2-1', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 206', 'W20-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 207', 'W20-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 208', 'W20-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 209-A', 'W20-1', 5);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 209-A', 'G20-2', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 209-B', 'W20-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 210', 'W20-1', 8);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 210', 'R2-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 211-A', 'W20-1', 5);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 211-B', 'W20-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 212-A', 'W20-1', 5);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 212-A', 'W20-5L', 1);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 212-A', 'W4-2L', 1);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 212-A', 'W5-5', 1);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 212-A', 'G20-2', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 212-B', 'W20-1', 6);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 212-B', 'W20-5L', 1);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 212-B', 'W4-2L', 1);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 212-B', 'W5-5', 1);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 212-B', 'G20-2', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 213-A', 'W20-1', 5);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 213-A', 'W20-5AL', 1);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 213-A', 'W4-2L', 1);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 213-A', 'G20-2', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 213-B', 'W20-1', 6);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 213-B', 'W20-5AL', 1);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 213-B', 'W4-2L', 1);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 213-B', 'G20-2', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 119', 'W20-1', 8);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 119', 'R2-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 123-A', 'W20-1', 5);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 123-B', 'W20-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 124', 'W20-1', 8);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 125-A', 'W20-1', 5);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 125-B', 'W20-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 126-A', 'W20-1', 5);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 126-B', 'W20-1', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 127-A', 'W20-1', 10);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 127-B', 'W20-1', 8);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 116-A', 'M4-10', 10);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 116-B', 'M4-10', 10);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 128', 'W16-10P', 2);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 128', 'M4-10', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 129', 'W16-10P', 2);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 129', 'M4-10', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 130', 'W16-10P', 2);
INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 130', 'M4-10', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 109-A', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 109-B', 'W8-11', 3);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 109-C', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 109-D', 'W8-11', 3);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 109-E', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 109-F', 'W8-11', 3);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 109-G', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 109-H', 'W8-11', 3);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 109-I', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 109-J', 'W8-11', 3);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 109-K', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 109-L', 'W8-11', 3);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-A', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-B', 'W8-11', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-C', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-D', 'W8-11', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-E', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-F', 'W8-11', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-G', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-H', 'W8-11', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-I', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-J', 'W8-11', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-K', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-L', 'W8-11', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-M', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-N', 'W8-11', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-O', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-P', 'W8-11', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-Q', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-R', 'W8-11', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-S', 'W8-11', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 110-T', 'W8-11', 4);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 112', 'W8-11', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 113', 'W8-11', 1);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 114', 'M4-12', 2);

INSERT INTO pata_kit_contents (pata_kit_code, sign_designation, quantity) VALUES ('PATA 115', 'M4-12', 1);
