'use server';

import { readFileSync } from 'fs';
import { join } from 'path';

export interface Sign {
  id: string;
  designation: string;
  description: string;
  sizes: string[];
  sheeting: string;
  category: string;
  kits: string[];
}

function parseCSV(): Sign[] {
  try {
    const filePath = join(process.cwd(), 'lib', 'master-signs.csv');
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const signs: Sign[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      // Parse CSV line handling quoted fields
      const fields: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      fields.push(current.trim().replace(/^"|"$/g, ''));

      if (fields.length < 2) continue;

      const designation = fields[0].trim();
      const description = fields[1].trim();
      const sheeting = (fields[9] || 'DG').trim();

      // Extract available sizes (fields 2-8)
      const sizes = fields
        .slice(2, 9)
        .filter(s => s && s.length > 0)
        .map(s => s.trim());

      // Determine category from designation prefix
      let category = 'Other';
      const prefix = designation.charAt(0);
      if (prefix === 'D') category = 'Destination';
      else if (prefix === 'G') category = 'Work Zone';
      else if (prefix === 'I') category = 'Information';
      else if (prefix === 'M') category = 'Marker';
      else if (prefix === 'R') category = 'Regulatory';
      else if (prefix === 'W') category = 'Warning';
      else if (prefix === 'O') category = 'Object Marker';

      // Assign to kits based on sign type
      const kits: string[] = [];
      if (prefix === 'R' || prefix === 'W') {
        // Regulatory and warning signs go to both
        kits.push('PATA', 'PTS');
      } else if (prefix === 'G') {
        // Work zone signs go to both
        kits.push('PATA', 'PTS');
      } else if (prefix === 'M') {
        // Markers typically go to PTS
        kits.push('PTS');
      } else if (prefix === 'D') {
        // Destination signs to PATA
        kits.push('PATA');
      }

      if (kits.length > 0) {
        signs.push({
          id: designation,
          designation,
          description,
          sizes: sizes.length > 0 ? sizes : ['Variable'],
          sheeting,
          category,
          kits,
        });
      }
    }

    return signs;
  } catch (error) {
    console.error('Error parsing signs CSV:', error);
    return [];
  }
}

export const signs = parseCSV();

export const categories = Array.from(
  new Set(signs.map(s => s.category).filter(Boolean))
).sort();

export const kitTypes = ['PATA', 'PTS'] as const;

export async function getSignsByKit(kit: string): Promise<Sign[]> {
  return signs.filter(s => s.kits.includes(kit)).sort((a, b) => a.designation.localeCompare(b.designation));
}

export async function getSignsByCategory(category: string): Promise<Sign[]> {
  return signs.filter(s => s.category === category).sort((a, b) => a.designation.localeCompare(b.designation));
}
