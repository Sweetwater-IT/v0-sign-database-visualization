import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// CSV data embedded directly
const csvData = `designation,description,size_1,size_2,size_3,size_4,size_5,size_6,size_7,sheeting
D1-1,SINGLE-LINE DESTINATION,48 x 8,72 x 12,,,,,,DG
D1-1A,SINGLE-LINE DESTINATION MILEAGE,48 x 8,72 x 12,,,,,,DG
D1-2,DOUBLE-LINE DESTINATION,48 x 16,72 x 24,,,,,,DG
D1-2A,DOUBLE-LINE DESTINATION MILEAGE,48 x 16,72 x 24,,,,,,DG
D1-3,TRIPLE-LINE DESTINATION,48 x 24,72 x 36,,,,,,DG
D1-3A,TRIPLE-LINE DESTINATION MILEAGE,48 x 24,72 x 36,,,,,,DG
D2-1,SINGLE-LINE DISTANCE,48 x 8,72 x 12,,,,,,DG
D2-2,DOUBLE-LINE DISTANCE,48 x 16,72 x 24,,,,,,DG
D2-3,TRIPLE-LINE DISTANCE,48 x 24,72 x 36,,,,,,DG`;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function getCategory(designation: string): string {
  const prefix = designation.charAt(0);
  const secondChar = designation.charAt(1);
  
  if (prefix === 'D') return 'Destination';
  if (prefix === 'G') return 'Work Zone';
  if (prefix === 'I') return 'Information';
  if (prefix === 'M') return 'Marker';
  if (prefix === 'O' && secondChar === 'M') return 'Object Marker';
  if (prefix === 'R') return 'Regulatory';
  if (prefix === 'S') return 'School';
  if (prefix === 'W') return 'Warning';
  return 'Other';
}

function getKits(designation: string): string[] {
  const prefix = designation.charAt(0);
  
  // Assign kits based on sign type
  if (prefix === 'R' || prefix === 'W' || prefix === 'G') {
    return ['PATA', 'PTS'];
  }
  if (prefix === 'M') {
    return ['PATA', 'PTS'];
  }
  if (prefix === 'D') {
    return ['PATA'];
  }
  if (prefix === 'S') {
    return ['PATA', 'PTS'];
  }
  if (prefix === 'I') {
    return ['PATA', 'PTS'];
  }
  if (prefix === 'O') {
    return ['PTS'];
  }
  return [];
}

export async function GET() {
  try {
    // First, clear existing signs
    const { error: deleteError } = await supabase
      .from('signs')
      .delete()
      .neq('id', '');
    
    if (deleteError) {
      console.error('Delete error:', deleteError);
    }

    // Fetch the CSV file from the public folder
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'https://v0.dev' : 'http://localhost:3000'}/api/csv`);
    
    // Parse the CSV and insert all records
    const signs: any[] = [];
    const lines = csvData.split('\n');
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const fields = parseCSVLine(line);
      const designation = fields[0];
      const description = fields[1];
      const sheeting = fields[9] || 'DG';
      
      // Collect all non-empty sizes
      const sizes = fields.slice(2, 9).filter(s => s && s.length > 0);
      
      const category = getCategory(designation);
      const kits = getKits(designation);
      
      if (designation && description) {
        signs.push({
          id: designation,
          designation,
          description,
          sizes: sizes.length > 0 ? sizes : ['Variable'],
          sheeting,
          category,
          kits
        });
      }
    }

    // Insert in batches of 100
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < signs.length; i += batchSize) {
      const batch = signs.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('signs')
        .upsert(batch, { onConflict: 'id' });
      
      if (insertError) {
        console.error('Insert error:', insertError);
        return NextResponse.json({ error: insertError.message, insertedCount }, { status: 500 });
      }
      insertedCount += batch.length;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${insertedCount} signs`,
      totalSigns: signs.length
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
