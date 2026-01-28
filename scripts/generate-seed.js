const fs = require('fs');
const path = require('path');

// Read CSV
const csvPath = path.join(__dirname, 'master-signs.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n');

// Parse header
const headers = lines[0].split(',');

// Parse data
const signs = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const fields = line.split(',');
  const designation = fields[0].trim();
  const description = fields[1].trim();
  
  // Extract sizes (fields 2-8)
  const sizes = fields.slice(2, 9)
    .filter(s => s && s.trim() && s.trim() !== '""')
    .map(s => s.trim().replace(/^"|"$/g, ''));
  
  const sheeting = (fields[9] || 'DG').trim();
  
  // Determine category from first letter
  let category = 'Other';
  const prefix = designation.charAt(0);
  
  if (prefix === 'D') category = 'Destination';
  else if (prefix === 'G') category = 'Work Zone';
  else if (prefix === 'I') category = 'Information';
  else if (prefix === 'M') category = 'Marker';
  else if (prefix === 'R') category = 'Regulatory';
  else if (prefix === 'W') category = 'Warning';
  else if (prefix === 'O') category = 'Object Marker';
  
  signs.push({
    designation,
    description,
    sizes: sizes.length > 0 ? sizes : ['Variable'],
    sheeting,
    category
  });
}

// Generate SQL
let sql = `-- Seed MUTCD signs into the database\n`;
sql += `-- Generated from master-signs.csv\n\n`;

signs.forEach((sign, index) => {
  const designation = sign.designation.replace(/'/g, "''");
  const description = sign.description.replace(/'/g, "''");
  const sizesJson = JSON.stringify(sign.sizes).replace(/'/g, "''");
  
  sql += `INSERT INTO signs (designation, description, sizes, sheeting, category)\n`;
  sql += `VALUES ('${designation}', '${description}', '${sizesJson}', '${sign.sheeting}', '${sign.category}');\n`;
  
  if ((index + 1) % 50 === 0) {
    sql += `\n-- Batch ${Math.floor((index + 1) / 50)}\n`;
  }
});

// Write SQL file
const sqlPath = path.join(__dirname, '02-seed-signs.sql');
fs.writeFileSync(sqlPath, sql);

console.log(`Generated 02-seed-signs.sql with ${signs.length} signs`);
