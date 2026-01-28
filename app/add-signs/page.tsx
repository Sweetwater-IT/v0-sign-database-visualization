'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ArrowLeft, Plus, Trash2, Check } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Loading from '../loading';

interface Sign {
  id: string;
  designation: string;
  description: string;
  sizes: string[];
  sheeting: string;
  category: string;
  kits: string[];
  image_url?: string;
}

interface KitOption {
  id: string;
  code: string;
  description: string | null;
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AddSignsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kitType = (searchParams.get('type') || 'PATA') as 'PATA' | 'PTS';
  const kitCodeFromUrl = searchParams.get('kitCode') || '';

  const [signs, setSigns] = useState<Sign[]>([]);
  const [kitOptions, setKitOptions] = useState<KitOption[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedKitCode, setSelectedKitCode] = useState<string>(kitCodeFromUrl);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSigns, setSelectedSigns] = useState<Array<{sign: Sign; quantity: number}>>([]);
  const [existingKitSigns, setExistingKitSigns] = useState<Array<{sign_designation: string; quantity: number}>>([]);
  const [finishedKits, setFinishedKits] = useState<Set<string>>(new Set());

  // Fetch existing signs in selected kit
  useEffect(() => {
    const fetchExistingKitSigns = async () => {
      if (!selectedKitCode) {
        setExistingKitSigns([]);
        return;
      }

      try {
        const tableName = kitType === 'PATA' ? 'pata_kit_contents' : 'pts_kit_contents';
        const columnName = kitType === 'PATA' ? 'pata_kit_code' : 'pts_kit_code';
        
        const { data } = await supabase
          .from(tableName)
          .select('sign_designation, quantity')
          .eq(columnName, selectedKitCode)
          .order('sign_designation');
        
        setExistingKitSigns(data || []);
      } catch (error) {
        console.error('[v0] Error fetching existing kit signs:', error);
      }
    };

    fetchExistingKitSigns();
  }, [selectedKitCode, kitType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all signs
        const { data: signsData } = await supabase
          .from('signs')
          .select('*')
          .order('designation');
        setSigns(signsData || []);

        // Fetch kit options
        const tableName = kitType === 'PATA' ? 'pata_kits' : 'pts_kits';
        const { data: kitsData } = await supabase
          .from(tableName)
          .select('*')
          .order('code');
        setKitOptions(kitsData || []);
      } catch (error) {
        console.error('[v0] Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kitType]);

  const saveSigns = async () => {
    if (selectedSigns.length === 0 || !selectedKitCode) return;

    try {
      const tableName = kitType === 'PATA' ? 'pata_kit_contents' : 'pts_kit_contents';
      const columnName = kitType === 'PATA' ? 'pata_kit_code' : 'pts_kit_code';

      // Check which signs already exist
      const { data: existingSigns } = await supabase
        .from(tableName)
        .select('sign_designation')
        .eq(columnName, selectedKitCode);

      const existingSignDesignations = new Set(existingSigns?.map(s => s.sign_designation) || []);
      const newSigns = selectedSigns.filter(
        item => !existingSignDesignations.has(item.sign.designation)
      );

      if (newSigns.length > 0) {
        const inserts = newSigns.map(item => ({
          [columnName]: selectedKitCode,
          sign_designation: item.sign.designation,
          quantity: item.quantity
        }));

        const { error } = await supabase
          .from(tableName)
          .insert(inserts);

        if (error) throw error;
      }

      setSelectedSigns([]);
      setSearchQuery('');
    } catch (error) {
      console.error('[v0] Error saving signs:', error);
    }
  };

  const toggleKitFinished = (kitCode: string) => {
    setFinishedKits(prev => {
      const updated = new Set(prev);
      if (updated.has(kitCode)) {
        updated.delete(kitCode);
      } else {
        updated.add(kitCode);
      }
      return updated;
    });
  };

  if (loading) return <Loading />;

  const filteredSigns = signs.filter(sign =>
    sign.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sign.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add Signs to {kitType} Kits</h1>
              <p className="text-muted-foreground mt-1">Select a kit and add signs with quantities</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Selected Signs */}
          <div className="col-span-1">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-lg">Selected Signs ({selectedSigns.length})</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-2">
                {selectedSigns.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No signs selected</p>
                ) : (
                  selectedSigns.map((item, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-lg border border-border space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.sign.designation}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.sign.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setSelectedSigns(prev => prev.filter((_, i) => i !== idx))}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">Qty:</span>
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.quantity || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            const newQty = value === '' ? 0 : Math.max(1, parseInt(value) || 1);
                            setSelectedSigns(prev =>
                              prev.map((s, i) => i === idx ? {...s, quantity: newQty} : s)
                            );
                          }}
                          className="w-14 h-8 text-xs text-center"
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              {selectedSigns.length > 0 && (
                <div className="p-4 border-t border-border">
                  <Button
                    onClick={saveSigns}
                    disabled={!selectedKitCode}
                    className="w-full"
                  >
                    Save {selectedSigns.length} Sign{selectedSigns.length !== 1 ? 's' : ''} to Kit
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Search & Kits Table */}
          <div className="col-span-2 space-y-6">
            {/* Kit Selection with Existing Signs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Kit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedKitCode} onValueChange={setSelectedKitCode}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Choose a ${kitType} kit...`} />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {kitOptions.map(kit => (
                      <SelectItem key={kit.id} value={kit.code}>
                        {kit.code} - {kit.description || 'No description'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Existing Signs in Kit */}
                {selectedKitCode && existingKitSigns.length > 0 && (
                  <div className="border border-border rounded-lg p-3 bg-muted/50">
                    <p className="text-xs font-semibold mb-2 text-muted-foreground">Current Signs in Kit ({existingKitSigns.length})</p>
                    <div className="space-y-2">
                      {existingKitSigns.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-card rounded border border-border text-xs">
                          <span className="font-medium">{item.sign_designation}</span>
                          <span className="text-muted-foreground">Qty: {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedKitCode && existingKitSigns.length === 0 && (
                  <div className="border border-border rounded-lg p-3 bg-muted/50">
                    <p className="text-xs text-muted-foreground text-center">No signs in this kit yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Search Signs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search & Add Signs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by designation or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredSigns.slice(0, 30).map(sign => (
                    <div
                      key={sign.id}
                      className="flex items-center justify-between p-3 hover:bg-muted/50 rounded cursor-pointer border border-transparent hover:border-border transition-colors"
                      onClick={() => {
                        if (!selectedSigns.some(s => s.sign.id === sign.id)) {
                          setSelectedSigns(prev => [...prev, { sign, quantity: 1 }]);
                        }
                      }}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{sign.designation}</p>
                        <p className="text-xs text-muted-foreground truncate">{sign.description}</p>
                      </div>
                      {selectedSigns.some(s => s.sign.id === sign.id) && (
                        <Badge variant="secondary" className="text-xs">Added</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
