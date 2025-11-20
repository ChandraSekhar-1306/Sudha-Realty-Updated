
'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Property } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { ListFilter, RotateCcw, MapPin, Phone, Loader2, Search } from 'lucide-react';
import { PropertyCard } from '@/components/PropertyCard';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { useProperties } from '@/hooks/use-properties';
import { Input } from '@/components/ui/input';

type Filters = {
  price: [number, number];
  bedrooms: ('1' | '2' | '3' | '4' | '5+')[];
  bathrooms: ('1' | '2' | '3' | '4+')[];
  propertyType: ('Apartment' | 'Villa' | 'Open Plot' | 'Farmland')[];
  facing: ('North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West')[];
  saleType: ('Fresh Sales' | 'Resales')[];
  location: string;
};

const getDefaultFilters = (): Filters => ({
  price: [1000000, 50000000],
  bedrooms: [],
  bathrooms: [],
  propertyType: [],
  facing: [],
  saleType: [],
  location: '',
});

const FilterSidebar = ({ 
  filters, 
  onFilterChange,
  clearFilters,
  isSheet = false,
}: { 
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  clearFilters: () => void;
  isSheet?: boolean;
}) => {
    
    const currencyFormatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const handleCheckboxChange = (group: keyof Pick<Filters, 'bedrooms' | 'bathrooms' | 'propertyType' | 'facing' | 'saleType'>, value: string, checked: boolean) => {
      const currentValues = filters[group] as string[];
      const newValues = checked ? [...currentValues, value] : currentValues.filter(v => v !== value);
      onFilterChange({ [group]: newValues });
    };

    const isPlotOrFarmlandSelected = useMemo(() => {
        if (filters.propertyType.length === 0) return false;
        const residentialTypes = ['Apartment', 'Villa'];
        return filters.propertyType.every(type => !residentialTypes.includes(type));
    }, [filters.propertyType]);

    const content = (
      <div className="h-full flex flex-col mt-5">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-6 p-4">
              <div className="space-y-2">
                <Label className="font-semibold text-base">Location</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                        placeholder="Search location..."
                        value={filters.location}
                        onChange={(e) => onFilterChange({ location: e.target.value })}
                        className="pl-9"
                    />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="font-semibold text-base">Price Range</Label>
                <Slider
                    value={filters.price}
                    onValueChange={(newPrice) => onFilterChange({ price: newPrice as [number, number] })}
                    min={1000000}
                    max={50000000}
                    step={500000}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{currencyFormatter.format(filters.price[0])}</span>
                    <span>{currencyFormatter.format(filters.price[1])}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="font-semibold text-base">Property Type</Label>
                <div className="space-y-2">
                {(['Apartment', 'Villa', 'Open Plot', 'Farmland'] as const).map(type => (
                    <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`type-${type}`} 
                      checked={filters.propertyType.includes(type)}
                      onCheckedChange={(checked) => handleCheckboxChange('propertyType', type, !!checked)}
                    />
                    <Label htmlFor={`type-${type}`} className="font-normal">{type}</Label>
                    </div>
                ))}
                </div>
              </div>

               <div className="space-y-4">
                <Label className="font-semibold text-base">Sale Type</Label>
                <div className="space-y-2">
                {(['Fresh Sales', 'Resales'] as const).map(type => (
                    <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`saleType-${type}`} 
                      checked={filters.saleType.includes(type)}
                      onCheckedChange={(checked) => handleCheckboxChange('saleType', type, !!checked)}
                    />
                    <Label htmlFor={`saleType-${type}`} className="font-normal">{type}</Label>
                    </div>
                ))}
                </div>
              </div>

              <div className={`space-y-4 transition-opacity ${isPlotOrFarmlandSelected ? 'opacity-50' : 'opacity-100'}`}>
                <Label className="font-semibold text-base">Bedrooms</Label>
                <div className="space-y-2">
                {(['1', '2', '3', '4', '5+'] as const).map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`bed-${opt}`} 
                      checked={filters.bedrooms.includes(opt)}
                      onCheckedChange={(checked) => handleCheckboxChange('bedrooms', opt, !!checked)}
                      disabled={isPlotOrFarmlandSelected}
                    />
                    <Label htmlFor={`bed-${opt}`} className={`font-normal ${isPlotOrFarmlandSelected ? 'text-muted-foreground' : ''}`}>{opt} {opt === '5+' ? 'or more' : 'BHK'}</Label>
                    </div>
                ))}
                </div>
              </div>
              
              <div className={`space-y-4 transition-opacity ${isPlotOrFarmlandSelected ? 'opacity-50' : 'opacity-100'}`}>
                <Label className="font-semibold text-base">Bathrooms</Label>
                <div className="space-y-2">
                {(['1', '2', '3', '4+'] as const).map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`bath-${opt}`} 
                      checked={filters.bathrooms.includes(opt)}
                      onCheckedChange={(checked) => handleCheckboxChange('bathrooms', opt, !!checked)}
                      disabled={isPlotOrFarmlandSelected}
                    />
                    <Label htmlFor={`bath-${opt}`} className={`font-normal ${isPlotOrFarmlandSelected ? 'text-muted-foreground' : ''}`}>{opt} {opt.includes('+') ? 'or more' : ''}</Label>
                    </div>
                ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="font-semibold text-base">Facing</Label>
                <div className="space-y-2">
                {(['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'] as const).map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`face-${opt}`} 
                      checked={filters.facing.includes(opt)}
                      onCheckedChange={(checked) => handleCheckboxChange('facing', opt, !!checked)}
                    />
                    <Label htmlFor={`face-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                ))}
                </div>
              </div>
                
          </div>
         </ScrollArea>
          <div className="p-4 border-t sticky bottom-0 bg-card">
            <Button variant="outline" className="w-full" onClick={clearFilters}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
        </div>
      </div>
    );

    if (isSheet) {
      return (
        <div className="h-full flex flex-col bg-background">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-lg font-semibold">Filter Properties</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1">
             {content}
          </ScrollArea>
          <SheetFooter className="p-4 border-t bg-background">
            <SheetClose asChild>
                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      );
    }
    
    return (
      <Card className="border-0 shadow-none h-full flex flex-col bg-transparent">
        <CardHeader className="px-4 pt-0 pb-2">
          <CardTitle className="font-headline text-lg">Filter Properties</CardTitle>
        </CardHeader>
        {content}
      </Card>
    );
};

const popularLocations = [
    'Jubilee Hills',
    'Banjara Hills',
    'Hitech City',
    'Gachibowli',
    'Kompally',
    'Manikonda',
    'Financial District',
    'Moinabad',
];

const InsightsSidebar = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary"/>
                    Find by Location
                </CardTitle>
                <CardDescription>
                    Browse properties in popular areas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {popularLocations.map(location => (
                        <Button key={location} variant="outline" size="sm" asChild className="text-xs">
                            <Link href={`/properties?location=${location}`}>{location}</Link>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary"/>
                    Need Expert Guidance?
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    Still confused? Our expert can provide personalized advice tailored to your needs.
                </p>
                <Button asChild className="w-full">
                    <Link href="/consultation">Book a Consultation</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
)

export default function PropertiesPage() {
    const searchParams = useSearchParams();
    const { properties: allProperties, isLoading, error } = useProperties();
    
    const [filters, setFilters] = useState<Filters>(() => {
        const defaultFilters = getDefaultFilters();
        const location = searchParams.get('location');
        const type = searchParams.get('type') as Filters['propertyType'][number] | null;
        const typeIsValid = type && ['Apartment', 'Villa', 'Open Plot', 'Farmland'].includes(type)
        
        if (location) {
            defaultFilters.location = location;
        }
        if (type && typeIsValid) {
             defaultFilters.propertyType = [type];
        }
        return defaultFilters;
    });

    const handleFilterChange = (newFilters: Partial<Filters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    };
    
    const clearFilters = () => {
      setFilters(getDefaultFilters());
    };

    const filteredProperties = useMemo(() => {
        if (!allProperties) return [];
        let properties = allProperties.filter(p => !['Commercial Space', 'Office', 'Showroom', 'Warehouse'].includes(p.type));
        
        // Location filter
        if (filters.location) {
            properties = properties.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
        }

        properties = properties.filter(p => p.price >= filters.price[0] && p.price <= filters.price[1]);

        if (filters.bedrooms.length > 0 && !filters.propertyType.some(pt => ['Open Plot', 'Farmland'].includes(pt))) {
            properties = properties.filter(p => {
                if (!p.bedrooms) return false;
                if (filters.bedrooms.includes('5+')) {
                    return p.bedrooms >= 5 || filters.bedrooms.includes(String(p.bedrooms));
                }
                return filters.bedrooms.includes(String(p.bedrooms));
            });
        }
        
        if (filters.bathrooms.length > 0 && !filters.propertyType.some(pt => ['Open Plot', 'Farmland'].includes(pt))) {
            properties = properties.filter(p => {
                if (!p.bathrooms) return false;
                if (filters.bathrooms.includes('4+')) {
                    return p.bathrooms >= 4 || filters.bathrooms.includes(String(p.bathrooms));
                }
                return filters.bathrooms.includes(String(p.bathrooms));
            });
        }

        if (filters.propertyType.length > 0) {
            properties = properties.filter(p => filters.propertyType.includes(p.type as 'Apartment' | 'Villa' | 'Open Plot' | 'Farmland'));
        }

        if (filters.facing.length > 0) {
            properties = properties.filter(p => p.facing && filters.facing.includes(p.facing));
        }

        if (filters.saleType.length > 0) {
            properties = properties.filter(p => p.saleType && filters.saleType.includes(p.saleType));
        }

        return properties;
    }, [filters, allProperties]);
  
  return (
    <div className="bg-muted/40">
      <div className="w-full min-h-screen lg:grid lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[320px_1fr_320px]">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block bg-background border-r">
             <div className="sticky top-0 h-screen flex flex-col pt-24">
                <FilterSidebar 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  clearFilters={clearFilters}
                />
            </div>
          </aside>

          {/* Main Content */}
          <main className="py-8 px-4 sm:px-6 lg:px-8 pt-24">
             <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-2xl md:text-3xl font-bold">
                        Managed Properties
                    </h1>
                    <p className="text-muted-foreground text-sm">{filteredProperties.length} results found</p>
                </div>

                 <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden">
                            <ListFilter className="h-4 w-4" />
                            <span className="sr-only">Filters</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-sm p-0 flex flex-col">
                        <FilterSidebar 
                          filters={filters}
                          onFilterChange={handleFilterChange}
                          clearFilters={clearFilters}
                          isSheet
                        />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="space-y-6">
                {isLoading && (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {error && (
                  <Card className="text-center py-12 bg-destructive/10 border-destructive">
                    <CardContent>
                      <h3 className='text-xl font-semibold text-destructive'>Error loading properties</h3>
                      <p className='text-muted-foreground mt-2'>There was an issue fetching data from the server.</p>
                    </CardContent>
                  </Card>
                )}
                {!isLoading && !error && filteredProperties.length > 0 && (
                  filteredProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                  ))
                )}
                {!isLoading && !error && filteredProperties.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <h3 className='text-xl font-semibold'>No matching properties found</h3>
                      <p className='text-muted-foreground mt-2'>Try adjusting your filters to find what you're looking for.</p>
                      <Button variant="outline" className='mt-4' onClick={clearFilters}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Clear All Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
            </div>
          </main>

          {/* Insights Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-0 h-screen overflow-y-auto pt-24 pb-8">
                <div className="space-y-6 pr-4 xl:pr-6">
                    <InsightsSidebar />
                </div>
            </div>
          </aside>
        </div>
    </div>
  );
}

