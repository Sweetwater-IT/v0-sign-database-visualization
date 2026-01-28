import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
        },
      }
    );

    // Read the CSV file
    const csvPath = join(process.cwd(), 'lib', 'master-signs.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    const lines = csvContent.trim().split('\n');

    // Parse CSV and prepare data
    const signs = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      // Parse CSV line with proper quote handling
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

      // Extract sizes
      const sizes = fields
        .slice(2, 9)
        .filter(s => s && s.length > 0)
        .map(s => s.trim());

      // Determine category from designation
      let category = 'Other';
      const prefix = designation.charAt(0);
      if (prefix === 'D') category = 'Destination';
      else if (prefix === 'G') category = 'Work Zone';
      else if (prefix === 'I') category = 'Information';
      else if (prefix === 'M') category = 'Marker';
      else if (prefix === 'R') category = 'Regulatory';
      else if (prefix === 'W') category = 'Warning';
      else if (prefix === 'O') category = 'Object Marker';
      else if (prefix === 'S') category = 'School';

      // Assign to kits
      const kits: string[] = [];
      if (prefix === 'R' || prefix === 'W' || prefix === 'G') {
        kits.push('PATA', 'PTS');
      } else if (prefix === 'M') {
        kits.push('PTS');
      } else if (prefix === 'D') {
        kits.push('PATA');
      } else {
        kits.push('PATA', 'PTS');
      }

      signs.push({
        id: designation,
        designation,
        description,
        sizes: sizes.length > 0 ? sizes : ['Various'],
        sheeting,
        category,
        kits,
      });
    }

    console.log(`[v0] Parsed ${signs.length} signs from CSV`);

    // Delete existing and insert all at once
    await supabase.from('signs').delete().neq('id', '');

    // Insert in batches of 100 to avoid payload issues
    for (let i = 0; i < signs.length; i += 100) {
      const batch = signs.slice(i, i + 100);
      const { error } = await supabase.from('signs').insert(batch);
      if (error) {
        console.error(`[v0] Error inserting batch ${i / 100}:`, error);
      }
    }

    console.log(`[v0] Inserted ${signs.length} signs into database`);

    return Response.json({
      success: true,
      count: signs.length,
      message: `Loaded ${signs.length} MUTCD signs from CSV`,
    });
  } catch (error) {
    console.error('[v0] Seed error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
