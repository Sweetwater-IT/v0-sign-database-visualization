'use client';

import { DialogDescription } from "@/components/ui/dialog"
import { DialogTitle } from "@/components/ui/dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { DialogContent } from "@/components/ui/dialog"
import { Dialog } from "@/components/ui/dialog"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Trash2, LayoutGrid, List, X, CheckCircle2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useSearchParams } from 'next/navigation';
import Loading from './loading'; // Import the Loading component
import { QuantityInput } from '@/components/quantity-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ViewMode = 'grid' | 'list';
type TabValue = 'catalog' | 'pata' | 'pts';

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

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// MUTCD Category color mapping
const getCategoryColor = (category: string): { bg: string; border: string; text: string } => {
  switch (category) {
    case 'Warning':
      return { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-900' };
    case 'School':
      return { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-900' };
    case 'Regulatory':
      return { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-900' };
    case 'Destination':
      return { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-900' };
    case 'Work Zone':
      return { bg: 'bg-amber-100', border: 'border-amber-500', text: 'text-amber-900' };
    default:
      return { bg: 'bg-slate-100', border: 'border-slate-500', text: 'text-slate-900' };
  }
};

export default function SignKitManager() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use useSearchParams here
  const [signs, setSigns] = useState<Sign[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState<TabValue>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [pataKit, setPataKit] = useState<Sign[]>([]);
  const [ptsKit, setPtsKit] = useState<Sign[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ptsKitOptions, setPtsKitOptions] = useState<Array<{ id: string; code: string; description?: string }>>([]);
  const [selectedPtsKit, setSelectedPtsKit] = useState<string | null>(null);
  const [expandedPtsKit, setExpandedPtsKit] = useState<string | null>(null);
  const [pataKitOptions, setPataKitOptions] = useState<Array<{ id: string; code: string; description?: string }>>([]);
  const [expandedPataKit, setExpandedPataKit] = useState<string | null>(null);
  const [ptsKitContents, setPtsKitContents] = useState<Record<string, Array<{ sign_designation: string; quantity: number; image_url?: string }>>>({});
  const [pataKitContents, setPataKitContents] = useState<Record<string, Array<{ sign_designation: string; quantity: number; image_url?: string }>>>({});
  const [pataKitFinished, setPataKitFinished] = useState<Record<string, boolean>>({});
  const [ptsKitFinished, setPtsKitFinished] = useState<Record<string, boolean>>({});
  const [selectedPataVariant, setSelectedPataVariant] = useState<Record<string, 'A' | 'B' | null>>({});
  const [selectedPtsVariant, setSelectedPtsVariant] = useState<Record<string, 'A' | 'B' | null>>({});
  const [pataKitVariants, setPataKitVariants] = useState<Record<string, Array<any>>>({});
  const [expandedPataVariant, setExpandedPataVariant] = useState<string | null>(null);
  
  // Dialog states for adding to kits
  const [showAddPataDialog, setShowAddPataDialog] = useState(false);
  const [showAddPtsDialog, setShowAddPtsDialog] = useState(false);
  const [selectedSignForKit, setSelectedSignForKit] = useState<Sign | null>(null);
  const [selectedKitCode, setSelectedKitCode] = useState<string>('');
  const [kitSignQuantity, setKitSignQuantity] = useState('1');
  
  // Bulk Add Dialog states
  const [showBulkAddDialog, setShowBulkAddDialog] = useState(false);
  const [bulkAddSelectedSigns, setBulkAddSelectedSigns] = useState<Array<{ sign: Sign; quantity: number }>>([]);
  const [bulkAddSearchQuery, setBulkAddSearchQuery] = useState('');
  const [bulkAddKitCode, setBulkAddKitCode] = useState<string | null>(null);
  const [bulkAddKitType, setBulkAddKitType] = useState<'PATA' | 'PTS'>('PATA');
  
  const itemsPerPage = 50;

  // Filter and paginate signs
  const catalogSigns = signs.filter(sign => {
    const matchesSearch = searchTerm === '' || 
      sign.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || sign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(catalogSigns.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedSigns = catalogSigns.slice(startIdx, endIdx);

  // Add sign to kit function
  const addToKit = async (kitCode: string, kitType: 'PATA' | 'PTS', quantity: number) => {
    if (!selectedSignForKit) return;
    
    try {
      const table = kitType === 'PATA' ? 'pata_kit_contents' : 'pts_kit_contents';
      const kitCodeColumn = kitType === 'PATA' ? 'pata_kit_code' : 'pts_kit_code';
      
      const { error } = await supabase
        .from(table)
        .insert({
          [kitCodeColumn]: kitCode,
          sign_designation: selectedSignForKit.designation,
          quantity: quantity
        });
      
      if (error) throw error;
      
      // Clear the kit contents cache for this kit so it refetches
      if (kitType === 'PATA') {
        setPataKitContents(prev => {
          const newContents = {...prev};
          delete newContents[kitCode];
          return newContents;
        });
        setShowAddPataDialog(false);
      } else {
        setPtsKitContents(prev => {
          const newContents = {...prev};
          delete newContents[kitCode];
          return newContents;
        });
        setShowAddPtsDialog(false);
      }
      
      setSelectedSignForKit(null);
      setSelectedKitCode('');
      setKitSignQuantity('1');
    } catch (error) {
      console.error('[v0] Error adding sign to kit:', error);
    }
  };

  // Fetch signs from Supabase
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchSigns = async () => {
      try {
        console.log('[v0] Fetching signs from Supabase (attempt', retryCount + 1, ')...');
        const { data, error } = await supabase
          .from('signs')
          .select('*')
          .order('designation', { ascending: true })
          .range(0, 999);

        if (error) {
          console.error('[v0] Supabase error details:', error.message, error.code, error.status);
          
          // Retry logic for transient errors
          if (retryCount < maxRetries && error.status !== 401 && error.status !== 403) {
            retryCount++;
            setTimeout(() => {
              if (isMounted) fetchSigns();
            }, 1000 * retryCount);
            return;
          }
          
          throw error;
        }

        if (!isMounted) return;
        
        console.log('[v0] Fetched signs:', data?.length || 0);
        setSigns(data || []);
        const uniqueCategories = Array.from(
          new Set((data || []).map(s => s.category).filter(Boolean))
        ).sort();
        setCategories(uniqueCategories as string[]);
        setLoading(false);
      } catch (error: any) {
        if (!isMounted) return;
        console.error('[v0] Error fetching signs:', error?.message || error);
        // Set empty signs array to prevent blocking UI
        setSigns([]);
        setCategories([]);
        setLoading(false);
      }
    };

    fetchSigns();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch PTS kit options
  useEffect(() => {
    const fetchPtsKits = async () => {
      try {
        const { data, error } = await supabase
          .from('pts_kits')
          .select('id, code, description, finished, blights, has_variants, team_check, page')
          .order('code', { ascending: true });
        
        if (error) throw error;
        console.log('[v0] Fetched PTS kits:', data?.length);
        setPtsKitOptions(data || []);
        
        // Populate finished state
        if (data) {
          const finishedMap = data.reduce((acc, kit) => {
            acc[kit.code] = kit.finished || false;
            return acc;
          }, {} as Record<string, boolean>);
          setPtsKitFinished(finishedMap);
        }
      } catch (error) {
        console.error('[v0] Error fetching PTS kits:', error);
      }
    };

    fetchPtsKits();
  }, []);

  // Fetch PATA kit variants
  useEffect(() => {
    const fetchPataVariants = async () => {
      try {
        const { data, error } = await supabase
          .from('kit_variants')
          .select('*')
          .order('kit_id, variant_label', { ascending: true });
        
        if (error) throw error;
        
        // Group variants by kit_id
        const variantsByKit: Record<string, Array<any>> = {};
        data?.forEach(variant => {
          const kitId = variant.kit_id.toString();
          if (!variantsByKit[kitId]) {
            variantsByKit[kitId] = [];
          }
          variantsByKit[kitId].push(variant);
        });
        setPataKitVariants(variantsByKit);
      } catch (error) {
        console.error('[v0] Error fetching PATA kit variants:', error);
      }
    };

    fetchPataVariants();
  }, []);

  // Fetch PATA kit options
  useEffect(() => {
    const fetchPataKits = async () => {
      try {
        const { data, error } = await supabase
          .from('pata_kits')
          .select('id, code, description, finished, blights, has_variants, team_check')
          .order('code', { ascending: true });
        
        if (error) throw error;
        console.log('[v0] Fetched PATA kits:', data?.length);
        const variantKits = data?.filter(k => ['402', '403', '404', '405', '406', '409', '502', '503', '504', '505', '506', '507', '508'].some(code => k.code.includes(code)));
        console.log('[v0] PATA kits that should have variants:', variantKits?.map(k => ({code: k.code, has_variants: k.has_variants})));
        setPataKitOptions(data || []);
        
        // Populate finished state
        if (data) {
          const finishedMap = data.reduce((acc, kit) => {
            acc[kit.code] = kit.finished || false;
            return acc;
          }, {} as Record<string, boolean>);
          setPataKitFinished(finishedMap);
        }
      } catch (error) {
        console.error('[v0] Error fetching PATA kits:', error);
      }
    };

    fetchPataKits();
  }, []);

  // Fetch PTS kit contents when a kit is expanded
  useEffect(() => {
    if (!expandedPtsKit || ptsKitContents[expandedPtsKit]) return;

    const fetchKitContents = async () => {
      try {
        const { data, error } = await supabase
          .from('pts_kit_contents')
          .select('sign_designation, quantity')
          .eq('pts_kit_code', expandedPtsKit)
          .order('sign_designation', { ascending: true });

        if (error) throw error;
        console.log('[v0] PTS kit contents for', expandedPtsKit, ':', data?.length, 'signs');

        // Fetch sign images and descriptions for each sign in the kit
        if (data && data.length > 0) {
          const signDesignations = data.map(item => item.sign_designation);
          const { data: signsData } = await supabase
            .from('signs')
            .select('designation, image_url, description')
            .in('designation', signDesignations);

          const signImageMap: Record<string, string | undefined> = {};
          const signDescriptionMap: Record<string, string | undefined> = {};
          signsData?.forEach(sign => {
            signImageMap[sign.designation] = sign.image_url;
            signDescriptionMap[sign.designation] = sign.description;
          });

          const enrichedData = data.map(item => ({
            ...item,
            image_url: signImageMap[item.sign_designation],
            description: signDescriptionMap[item.sign_designation]
          }));

          setPtsKitContents(prev => ({
            ...prev,
            [expandedPtsKit]: enrichedData
          }));
        } else {
          setPtsKitContents(prev => ({
            ...prev,
            [expandedPtsKit]: []
          }));
        }
      } catch (error) {
        console.error('[v0] Error fetching PTS kit contents:', error);
      }
    };

    fetchKitContents();
  }, [expandedPtsKit]);

  // Fetch PATA kit contents when a kit is expanded
  useEffect(() => {
    if (!expandedPataKit || pataKitContents[expandedPataKit]) return;

    const fetchKitContents = async () => {
      try {
        const { data, error } = await supabase
          .from('pata_kit_contents')
          .select('sign_designation, quantity')
          .eq('pata_kit_code', expandedPataKit)
          .order('sign_designation', { ascending: true });

        if (error) throw error;

        // Fetch sign images and descriptions for each sign in the kit
        if (data && data.length > 0) {
          const signDesignations = data.map(item => item.sign_designation);
          const { data: signsData } = await supabase
            .from('signs')
            .select('designation, image_url, description')
            .in('designation', signDesignations);

          const signImageMap: Record<string, string | undefined> = {};
          const signDescriptionMap: Record<string, string | undefined> = {};
          signsData?.forEach(sign => {
            signImageMap[sign.designation] = sign.image_url;
            signDescriptionMap[sign.designation] = sign.description;
          });

          const enrichedData = data.map(item => ({
            ...item,
            image_url: signImageMap[item.sign_designation],
            description: signDescriptionMap[item.sign_designation]
          }));

          setPataKitContents(prev => ({
            ...prev,
            [expandedPataKit]: enrichedData
          }));
        } else {
          setPataKitContents(prev => ({
            ...prev,
            [expandedPataKit]: []
          }));
        }
      } catch (error) {
        console.error('[v0] Error fetching PATA kit contents:', error);
      }
    };

    fetchKitContents();
  }, [expandedPataKit]);

  const toggleTeamCheck = async (kitType: 'PATA' | 'PTS', kitCode: string) => {
    try {
      const table = kitType === 'PATA' ? 'pata_kits' : 'pts_kits';
      const isCurrentlyChecked = kitType === 'PATA' 
        ? pataKitOptions.find(k => k.code === kitCode)?.team_check 
        : ptsKitOptions.find(k => k.code === kitCode)?.team_check;
      
      const { error } = await supabase
        .from(table)
        .update({ team_check: !isCurrentlyChecked })
        .eq('code', kitCode);
      
      if (error) throw error;
      
      // Update local state
      if (kitType === 'PATA') {
        setPataKitOptions(prev =>
          prev.map(k => k.code === kitCode ? {...k, team_check: !isCurrentlyChecked} : k)
        );
      } else {
        setPtsKitOptions(prev =>
          prev.map(k => k.code === kitCode ? {...k, team_check: !isCurrentlyChecked} : k)
        );
      }
    } catch (error) {
      console.error('[v0] Error toggling team check:', error);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      console.log('[v0] Starting database seed...');
      const response = await fetch('/api/seed-from-csv');
      const result = await response.json();
      console.log('[v0] Seed complete:', result);
      // Refetch signs after seeding
      const { data } = await supabase
        .from('signs')
        .select('*')
        .order('designation', { ascending: true })
        .range(0, 999);
      if (data) {
        setSigns(data);
        const uniqueCategories = Array.from(
          new Set(data.map(s => s.category).filter(Boolean))
        ).sort();
        setCategories(uniqueCategories as string[]);
        setCurrentPage(1);
        console.log('[v0] Database refreshed with', data.length, 'signs');
      }
    } catch (error) {
      console.error('[v0] Seed error:', error);
    } finally {
      setSeeding(false);
    }
  };

  const saveBulkSignsToKit = async () => {
    // Implementation for saving bulk signs to kit
  };

  const SignCard = ({ sign, onAddToPata, onAddToPts, showActions = true }: {
    sign: Sign;
    onAddToPata?: () => void;
    onAddToPts?: () => void;
    showActions?: boolean;
  }) => {
    const categoryColors = getCategoryColor(sign.category);
    return (
      <Card className="hover:shadow-md transition-shadow overflow-hidden flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-primary">{sign.designation}</CardTitle>
              <CardDescription className="text-sm mt-1">{sign.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Image as icon */}
              {sign.image_url && (
                <div className="w-16 h-16 bg-white border border-border rounded flex items-center justify-center flex-shrink-0">
                  <img 
                    src={sign.image_url || "/placeholder.svg"} 
                    alt={sign.designation}
                    className="w-14 h-14 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`text-xs ${categoryColors.bg} ${categoryColors.border} ${categoryColors.text} border`}>
              {sign.category}
            </Badge>
            {sign.sheeting && (
              <Badge variant="outline" className="text-xs border">
                {sign.sheeting}
              </Badge>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">Available Sizes</p>
            <div className="flex flex-wrap gap-1">
              {sign.sizes.map((size, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {size}
                </Badge>
              ))}
            </div>
          </div>
          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onAddToPata}
                className="flex-1 text-xs bg-transparent"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add to PATA
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onAddToPts}
                className="flex-1 text-xs bg-transparent"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add to PTS
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const KitSignCard = ({ sign, onRemove }: {
    sign: Sign;
    onRemove: () => void;
  }) => (
    <Card className="flex items-center justify-between p-4">
      <div className="flex-1">
        <p className="font-semibold text-sm text-primary">{sign.designation}</p>
        <p className="text-xs text-muted-foreground">{sign.description}</p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={onRemove}
        className="text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </Card>
  );

  const SignsGrid = ({ signList }: { signList: Sign[] }) => {
    if (viewMode === 'list') {
      return (
        <div className="space-y-4">
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-0 bg-muted/50 border-b border-border px-4 py-2">
              <div className="col-span-2">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Designation</p>
              </div>
              <div className="col-span-5">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Description</p>
              </div>
              <div className="col-span-5">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Category & Sheeting</p>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border">
              {signList.map((sign, idx) => (
                <div 
                  key={sign.id} 
                  className={`grid grid-cols-12 gap-0 px-4 py-2.5 hover:bg-muted/30 transition-colors ${
                    idx % 2 === 0 ? 'bg-background' : 'bg-muted/5'
                  }`}
                >
                  <div className="col-span-2 flex items-center gap-2">
                    {sign.image_url && (
                      <div className="w-8 h-8 bg-white border border-border rounded flex items-center justify-center flex-shrink-0">
                        <img 
                          src={sign.image_url || "/placeholder.svg"} 
                          alt={sign.designation}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-primary">{sign.designation}</span>
                  </div>
                  <div className="col-span-5 flex items-center">
                    <span className="text-sm text-foreground/80 line-clamp-1">{sign.description}</span>
                  </div>
                  <div className="col-span-5 flex items-center gap-2">
                    <Badge className={`text-xs ${getCategoryColor(sign.category).bg} ${getCategoryColor(sign.category).border} ${getCategoryColor(sign.category).text} border`}>
                      {sign.category}
                    </Badge>
                    {sign.sheeting && (
                      <Badge variant="outline" className="text-xs border">
                        {sign.sheeting}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border border-border rounded-lg bg-card">
              <div className="text-sm text-muted-foreground">
                Showing {startIdx + 1}-{Math.min(endIdx, signList.length)} of {signList.length} signs
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentPage(Math.max(1, currentPage - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-8 h-8 p-0 text-xs"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && <span className="px-2 text-xs text-muted-foreground">...</span>}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentPage(Math.min(totalPages, currentPage + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Grid view with pagination
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signList.map(sign => (
            <SignCard
              key={sign.id}
              sign={sign}
              onAddToPata={() => {
                setSelectedSignForKit(sign);
                setShowAddPataDialog(true);
              }}
              onAddToPts={() => {
                setSelectedSignForKit(sign);
                setShowAddPtsDialog(true);
              }}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border border-border rounded-lg bg-card">
            <div className="text-sm text-muted-foreground">
              Showing {startIdx + 1}-{Math.min(endIdx, signList.length)} of {signList.length} signs
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentPage(Math.max(1, currentPage - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-8 h-8 p-0 text-xs"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && <span className="px-2 text-xs text-muted-foreground">...</span>}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentPage(Math.min(totalPages, currentPage + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading sign database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">ETC Sign Kit Manager</h1>
              <p className="text-sm text-muted-foreground">Full sign list, PTS kits, and PATA kits</p>
            </div>
            {signs.length < 700 && (
              <Button 
                onClick={handleSeedDatabase} 
                disabled={seeding}
                className="whitespace-nowrap bg-transparent"
                variant="outline"
              >
                {seeding ? 'Seeding...' : `Load All (${signs.length}/768)`}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg mb-6">
            <TabsTrigger value="catalog" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Sign Catalogue
              <Badge variant="secondary" className="ml-2 bg-slate-200 text-slate-700">
                {signs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pata" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              PATA Kits
              <Badge variant="secondary" className="ml-2 bg-slate-200 text-slate-700">
                {pataKitOptions.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pts" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              PTS Kits
              <Badge variant="secondary" className="ml-2 bg-slate-200 text-slate-700">
                {ptsKitOptions.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Catalog Tab */}
          <TabsContent value="catalog" className="mt-6 space-y-4">
            {/* Search and View Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end mb-6">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by designation or description..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentPage(1);
                }}
                className={selectedCategory === null ? '' : ''}
              >
                All Categories ({signs.length})
              </Button>
              {categories.map(category => {
                const count = signs.filter(s => s.category === category).length;
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                  >
                    {category} ({count})
                  </Button>
                );
              })}
            </div>
            {catalogSigns.length > 0 ? (
              <SignsGrid signList={paginatedSigns} />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No signs found matching your criteria.</p>
              </Card>
            )}
          </TabsContent>

          {/* PATA Kit Tab */}
          <TabsContent value="pata" className="mt-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">PATA Kits</h2>
              <Button
                onClick={() => router.push('/add-signs?type=PATA')}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Signs to Kit
              </Button>
            </div>
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-0 bg-muted/50 border-b border-border px-4 py-2">
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Kit Code</p>
                </div>
                <div className="col-span-9">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Description</p>
                </div>
                <div className="col-span-1">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Status</p>
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-border">
                {pataKitOptions.map((kit) => {
                  const hasVariants = kit.has_variants === true;
                  
                  return (
                  <div key={kit.id}>
                    {/* Kit Row */}
                    <div 
                      onClick={() => setExpandedPataKit(expandedPataKit === kit.code ? null : kit.code)}
                      className="grid grid-cols-12 gap-0 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div className="col-span-2 flex items-center">
                        <svg 
                          className={`w-5 h-5 text-primary transition-transform duration-200 mr-2 ${expandedPataKit === kit.code ? 'rotate-90' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span className="text-sm font-semibold text-primary cursor-pointer">{kit.code}</span>
                      </div>
                      <div className="col-span-8 flex items-center">
                        <span className="text-sm text-foreground">{kit.description || 'No description available'}</span>
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        {pataKitFinished[kit.code] ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                        )}
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTeamCheck('PATA', kit.code);
                          }}
                        >
                          {kit.team_check ? (
                            <div className="w-5 h-5 bg-red-600 rounded" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-red-600 rounded" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Content - Show Variant Selector if has variants */}
                    {expandedPataKit === kit.code && hasVariants && !selectedPataVariant[kit.code] && (
                      <div className="bg-muted/5 px-4 py-6 border-t border-border">
                        <div className="flex flex-col items-center gap-4">
                          <p className="text-sm font-semibold text-foreground">Select which option you want to edit:</p>
                          <div className="flex gap-3">
                            <Button
                              size="lg"
                              onClick={() => setSelectedPataVariant(prev => ({...prev, [kit.code]: 'A'}))}
                              className="w-32"
                            >
                              Option A
                            </Button>
                            <Button
                              size="lg"
                              onClick={() => setSelectedPataVariant(prev => ({...prev, [kit.code]: 'B'}))}
                              className="w-32"
                            >
                              Option B
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expanded Content - Show signs/blights when: no variants OR variant is selected */}
                    {expandedPataKit === kit.code && (!hasVariants || selectedPataVariant[kit.code]) && (
                      <div className="bg-muted/5 px-4 py-4 border-t border-border">
                        <div className="grid grid-cols-2 gap-6">
                          {/* Left Column: Blights and Signs */}
                          <div className="space-y-4">
                            {/* Blights Section */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-semibold text-foreground min-w-fit">Blights:</label>
                              <div className="w-40">
                                <QuantityInput
                                  value={kit.blights || 0}
                                  onChange={async (newValue) => {
                                    try {
                                      const { error } = await supabase
                                        .from('pata_kits')
                                        .update({ blights: newValue })
                                        .eq('code', kit.code);

                                      if (error) throw error;

                                      setPataKitOptions(prev =>
                                        prev.map(k => k.code === kit.code ? {...k, blights: newValue} : k)
                                      );
                                    } catch (error) {
                                      console.error('[v0] Error updating blights:', error);
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            {/* Signs Section Header */}
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-foreground">Signs and quantities for {kit.code}</p>
                              <div className="flex items-center gap-2">
                                {!pataKitFinished[kit.code] && (
                                  <Button
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        const { error } = await supabase
                                          .from('pata_kits')
                                          .update({ finished: true })
                                          .eq('code', kit.code);

                                        if (error) throw error;

                                        setPataKitFinished(prev => ({
                                          ...prev,
                                          [kit.code]: true
                                        }));
                                      } catch (error) {
                                        console.error('[v0] Error marking kit as finished:', error);
                                      }
                                    }}
                                    variant="default"
                                    className="gap-1"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    Mark as Finished
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const variantParam = selectedPataVariant[kit.code] ? `&variant=${selectedPataVariant[kit.code]}` : '';
                                    router.push(`/add-signs?type=PATA&kitCode=${kit.code}${variantParam}`);
                                  }}
                                  className="gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  Add Sign
                                </Button>
                              </div>
                            </div>

                            {/* Signs Table */}
                            {pataKitContents[kit.code] && pataKitContents[kit.code].length > 0 ? (
                              <div className="overflow-x-auto">
                                <div className="flex gap-6">
                                  {(() => {
                                    const signs = pataKitContents[kit.code];
                                    const rowsPerColumn = 8;
                                    const columns = Math.ceil(signs.length / rowsPerColumn);
                                    const result = [];

                                    for (let col = 0; col < columns; col++) {
                                      const startIdx = col * rowsPerColumn;
                                      const endIdx = Math.min(startIdx + rowsPerColumn, signs.length);
                                      const columnSigns = signs.slice(startIdx, endIdx);

                                      result.push(
                                        <div key={col} className="flex flex-col border border-border rounded-lg overflow-hidden min-w-[600px]">
                                          {/* Column Header */}
                                          <div className="grid gap-4 bg-muted px-4 py-3 border-b border-border sticky top-0" style={{ gridTemplateColumns: '80px 120px 1fr 120px' }}>
                                            <div className="text-xs font-semibold text-foreground">Image</div>
                                            <div className="text-xs font-semibold text-foreground">Sign</div>
                                            <div className="text-xs font-semibold text-foreground">Description</div>
                                            <div className="text-xs font-semibold text-foreground text-center">Quantity</div>
                                          </div>

                                          {/* Column Rows */}
                                          {columnSigns.map((item, idx) => {
                                            const globalIdx = startIdx + idx;
                                            return (
                                              <div key={globalIdx} className="grid gap-4 px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors last:border-b-0" style={{ gridTemplateColumns: '80px 120px 1fr 120px' }}>
                                                {/* Image Thumbnail */}
                                                <div className="flex items-center justify-center">
                                                  <div className="w-16 h-16 bg-white border border-border rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {item.image_url ? (
                                                      <img
                                                        src={item.image_url || "/placeholder.svg"}
                                                        alt={item.sign_designation}
                                                        className="w-14 h-14 object-contain"
                                                        onError={(e) => {
                                                          e.currentTarget.style.display = 'none';
                                                        }}
                                                      />
                                                    ) : (
                                                      <div className="w-14 h-14 bg-slate-100 rounded flex items-center justify-center">
                                                        <span className="text-xs text-slate-400">—</span>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>

                                                {/* Sign Designation */}
                                                <div className="flex items-center">
                                                  <p className="text-sm font-medium text-foreground">{item.sign_designation}</p>
                                                </div>

                                                {/* Description */}
                                                <div className="flex items-center">
                                                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description || '-'}</p>
                                                </div>

                                                {/* Quantity with tight input */}
                                                <div className="flex items-center justify-center gap-1.5 pr-2">
                                                  <QuantityInput
                                                    value={item.quantity || 0}
                                                    onChange={async (newQty) => {
                                                      try {
                                                        const { error } = await supabase
                                                          .from('pata_kit_contents')
                                                          .update({ quantity: newQty })
                                                          .eq('pata_kit_code', kit.code)
                                                          .eq('sign_designation', item.sign_designation);

                                                        if (error) throw error;

                                                        setPataKitContents(prev => ({
                                                          ...prev,
                                                          [kit.code]: prev[kit.code].map((s, i) =>
                                                            i === globalIdx ? {...s, quantity: newQty} : s
                                                          )
                                                        }));
                                                      } catch (error) {
                                                        console.error('[v0] Error updating quantity:', error);
                                                      }
                                                    }}
                                                  />
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                                    onClick={async () => {
                                                      try {
                                                        const { error } = await supabase
                                                          .from('pata_kit_contents')
                                                          .delete()
                                                          .eq('pata_kit_code', kit.code)
                                                          .eq('sign_designation', item.sign_designation);

                                                        if (error) throw error;

                                                        setPataKitContents(prev => ({
                                                          ...prev,
                                                          [kit.code]: prev[kit.code].filter((_, i) => i !== globalIdx)
                                                        }));
                                                      } catch (error) {
                                                        console.error('[v0] Error deleting sign:', error);
                                                      }
                                                    }}
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </Button>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      );
                                    }
                                    return result;
                                  })()}
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground text-center py-6">No signs added yet</p>
                            )}
                          </div>

                          {/* Right Column: Kit Diagram */}
                          <div>
                            <h3 className="text-sm font-semibold text-foreground mb-2">Kit Diagram</h3>
                            <iframe
                              src={`/pata-diagrams/${kit.code}.pdf`}
                              className="w-full h-[600px] border rounded"
                              title={`PATA Kit ${kit.code} Diagram`}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* PTS Kit Tab */}
          <TabsContent value="pts" className="mt-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">PTS Kits</h2>
              <Button
                onClick={() => router.push('/add-signs?type=PTS')}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Signs to Kit
              </Button>
            </div>
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-0 bg-muted/50 border-b border-border px-4 py-2">
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Kit Code</p>
                </div>
                <div className="col-span-9">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Description</p>
                </div>
                <div className="col-span-1">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Status</p>
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-border">
                {ptsKitOptions.map((kit) => (
                  <div key={kit.id}>
                    {/* Kit Row */}
                    <div 
                      onClick={() => setExpandedPtsKit(expandedPtsKit === kit.code ? null : kit.code)}
                      className="grid grid-cols-12 gap-0 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div className="col-span-2 flex items-center">
                        <svg 
                          className={`w-5 h-5 text-primary transition-transform duration-200 mr-2 ${expandedPtsKit === kit.code ? 'rotate-90' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span className="text-sm font-semibold text-primary">{kit.code}</span>
                      </div>
                      <div className="col-span-8 flex items-center">
                        <span className="text-sm text-foreground">{kit.description || 'No description available'}</span>
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        {ptsKitFinished[kit.code] ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                        )}
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTeamCheck('PTS', kit.code);
                          }}
                        >
                          {kit.team_check ? (
                            <div className="w-5 h-5 bg-red-600 rounded" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-red-600 rounded" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedPtsKit === kit.code && kit.has_variants && !selectedPtsVariant[kit.code] && (
                      <div className="bg-muted/5 px-4 py-6 border-t border-border">
                        <div className="flex flex-col items-center gap-4">
                          <p className="text-sm font-semibold text-foreground">Select which option you want to edit:</p>
                          <div className="flex gap-3">
                            <Button
                              size="lg"
                              onClick={() => setSelectedPtsVariant(prev => ({...prev, [kit.code]: 'A'}))}
                              className="w-32"
                            >
                              Option A
                            </Button>
                            <Button
                              size="lg"
                              onClick={() => setSelectedPtsVariant(prev => ({...prev, [kit.code]: 'B'}))}
                              className="w-32"
                            >
                              Option B
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {expandedPtsKit === kit.code && (!kit.has_variants || selectedPtsVariant[kit.code]) && (
                      <div className="bg-muted/5 px-4 py-4 border-t border-border">
                        <div className="grid grid-cols-2 gap-6">
                          {/* Left Column: Blights and Signs */}
                          <div className="space-y-4">
                            {/* Blights Section */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-semibold text-foreground min-w-fit">Blights:</label>
                              <div className="w-40">
                                <QuantityInput
                                  value={kit.blights || 0}
                                  onChange={async (newValue) => {
                                    try {
                                      const { error } = await supabase
                                        .from('pts_kits')
                                        .update({ blights: newValue })
                                        .eq('code', kit.code);

                                      if (error) throw error;

                                      setPtsKitOptions(prev =>
                                        prev.map(k => k.code === kit.code ? {...k, blights: newValue} : k)
                                      );
                                    } catch (error) {
                                      console.error('[v0] Error updating blights:', error);
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            {/* Signs Section Header */}
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-foreground">Signs and quantities for {kit.code}</p>
                              <div className="flex items-center gap-2">
                                {!ptsKitFinished[kit.code] && (
                                  <Button
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        const { error } = await supabase
                                          .from('pts_kits')
                                          .update({ finished: true })
                                          .eq('code', kit.code);

                                        if (error) throw error;

                                        setPtsKitFinished(prev => ({
                                          ...prev,
                                          [kit.code]: true
                                        }));
                                      } catch (error) {
                                        console.error('[v0] Error marking kit as finished:', error);
                                      }
                                    }}
                                    variant="default"
                                    className="gap-1"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    Mark as Finished
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const variantParam = selectedPtsVariant[kit.code] ? `&variant=${selectedPtsVariant[kit.code]}` : '';
                                    router.push(`/add-signs?type=PTS&kitCode=${kit.code}${variantParam}`);
                                  }}
                                  className="gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  Add Sign
                                </Button>
                              </div>
                            </div>

                            {/* Signs Table */}
                            {ptsKitContents[kit.code] && ptsKitContents[kit.code].length > 0 ? (
                              <div className="overflow-x-auto">
                                <div className="flex gap-6">
                                  {(() => {
                                    const signs = ptsKitContents[kit.code];
                                    const rowsPerColumn = 8;
                                    const columns = Math.ceil(signs.length / rowsPerColumn);
                                    const result = [];

                                    for (let col = 0; col < columns; col++) {
                                      const startIdx = col * rowsPerColumn;
                                      const endIdx = Math.min(startIdx + rowsPerColumn, signs.length);
                                      const columnSigns = signs.slice(startIdx, endIdx);

                                      result.push(
                                        <div key={col} className="flex flex-col border border-border rounded-lg overflow-hidden min-w-[600px]">
                                          {/* Column Header */}
                                          <div className="grid gap-4 bg-muted px-4 py-3 border-b border-border sticky top-0" style={{ gridTemplateColumns: '80px 120px 1fr 120px' }}>
                                            <div className="text-xs font-semibold text-foreground">Image</div>
                                            <div className="text-xs font-semibold text-foreground">Sign</div>
                                            <div className="text-xs font-semibold text-foreground">Description</div>
                                            <div className="text-xs font-semibold text-foreground text-center">Quantity</div>
                                          </div>

                                          {/* Column Rows */}
                                          {columnSigns.map((item, idx) => {
                                            const globalIdx = startIdx + idx;
                                            return (
                                              <div key={globalIdx} className="grid gap-4 px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors last:border-b-0" style={{ gridTemplateColumns: '80px 120px 1fr 120px' }}>
                                                {/* Image Thumbnail */}
                                                <div className="flex items-center justify-center">
                                                  <div className="w-16 h-16 bg-white border border-border rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {item.image_url ? (
                                                      <img
                                                        src={item.image_url || "/placeholder.svg"}
                                                        alt={item.sign_designation}
                                                        className="w-14 h-14 object-contain"
                                                        onError={(e) => {
                                                          e.currentTarget.style.display = 'none';
                                                        }}
                                                      />
                                                    ) : (
                                                      <div className="w-14 h-14 bg-slate-100 rounded flex items-center justify-center">
                                                        <span className="text-sm text-slate-400">—</span>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>

                                                {/* Sign Designation */}
                                                <div className="flex items-center">
                                                  <p className="text-sm font-medium text-foreground">{item.sign_designation}</p>
                                                </div>

                                                {/* Description */}
                                                <div className="flex items-center">
                                                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description || '-'}</p>
                                                </div>

                                                {/* Quantity with tight input */}
                                                <div className="flex items-center justify-center gap-1.5 pr-2">
                                                  <QuantityInput
                                                    value={item.quantity || 0}
                                                    onChange={async (newQty) => {
                                                      try {
                                                        const { error } = await supabase
                                                          .from('pts_kit_contents')
                                                          .update({ quantity: newQty })
                                                          .eq('pts_kit_code', kit.code)
                                                          .eq('sign_designation', item.sign_designation);

                                                        if (error) throw error;

                                                        setPtsKitContents(prev => ({
                                                          ...prev,
                                                          [kit.code]: prev[kit.code].map((s, i) =>
                                                            i === globalIdx ? {...s, quantity: newQty} : s
                                                          )
                                                        }));
                                                      } catch (error) {
                                                        console.error('[v0] Error updating quantity:', error);
                                                      }
                                                    }}
                                                  />
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                                    onClick={async () => {
                                                      try {
                                                        const { error } = await supabase
                                                          .from('pts_kit_contents')
                                                          .delete()
                                                          .eq('pts_kit_code', kit.code)
                                                          .eq('sign_designation', item.sign_designation);

                                                        if (error) throw error;

                                                        setPtsKitContents(prev => ({
                                                          ...prev,
                                                          [kit.code]: prev[kit.code].filter((_, i) => i !== globalIdx)
                                                        }));
                                                      } catch (error) {
                                                        console.error('[v0] Error deleting sign:', error);
                                                      }
                                                    }}
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </Button>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      );
                                    }
                                    return result;
                                  })()}
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground text-center py-6">No signs added yet</p>
                            )}
                          </div>

                          {/* Right Column: Kit Diagram */}
                          <div>
                            <h3 className="text-sm font-semibold text-foreground mb-2">Kit Diagram</h3>
                            <img
                              src={kit.image_url}
                              alt={`PTS Kit ${kit.code} Diagram`}
                              className="w-full h-auto max-h-[80vh] object-contain border rounded"
                            />
                          </div>
=======
                            <img
                              src={kit.image_url}
                              alt={`PTS Kit ${kit.code} Diagram`}
                              className="w-full h-auto max-h-[80vh] object-contain border rounded"
>>>>>>> cd5050f (Replace PTS iframe with img tag for PNG diagrams)
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>

      {/* Add to PATA Kit Dialog */}
      <Dialog open={showAddPataDialog} onOpenChange={setShowAddPataDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Sign to PATA Kit</DialogTitle>
            <DialogDescription>
              Select which PATA kit to add {selectedSignForKit?.designation} to, and specify the quantity
            </DialogDescription>
          </DialogHeader>
          {selectedSignForKit && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-semibold text-foreground">{selectedSignForKit.designation}</p>
                <p className="text-xs text-muted-foreground">{selectedSignForKit.description}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Select PATA Kit</label>
                <Select value={selectedKitCode} onValueChange={setSelectedKitCode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a PATA kit..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {pataKitOptions.map(kit => (
                      <SelectItem key={kit.id} value={kit.code}>
                        {kit.code} - {kit.description || 'No description'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={kitSignQuantity}
                  onChange={(e) => setKitSignQuantity(e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAddPataDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedKitCode) {
                      addToKit(selectedKitCode, 'PATA', parseInt(kitSignQuantity) || 1);
                    }
                  }}
                  disabled={!selectedKitCode}
                >
                  Add to Kit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add to PTS Kit Dialog */}
      <Dialog open={showAddPtsDialog} onOpenChange={setShowAddPtsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Sign to PTS Kit</DialogTitle>
            <DialogDescription>
              Select which PTS kit to add {selectedSignForKit?.designation} to, and specify the quantity
            </DialogDescription>
          </DialogHeader>
          {selectedSignForKit && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-semibold text-foreground">{selectedSignForKit.designation}</p>
                <p className="text-xs text-muted-foreground">{selectedSignForKit.description}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Select PTS Kit</label>
                <Select value={selectedKitCode} onValueChange={setSelectedKitCode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a PTS kit..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {ptsKitOptions.map(kit => (
                      <SelectItem key={kit.id} value={kit.code}>
                        {kit.code} - {kit.description || 'No description'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={kitSignQuantity}
                  onChange={(e) => setKitSignQuantity(e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAddPtsDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedKitCode) {
                      addToKit(selectedKitCode, 'PTS', parseInt(kitSignQuantity) || 1);
                    }
                  }}
                  disabled={!selectedKitCode}
                >
                  Add to Kit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
