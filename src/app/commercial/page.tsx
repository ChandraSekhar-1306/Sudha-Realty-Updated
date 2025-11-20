
'use client';

import React, { useState, useMemo } from 'react';
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
import { properties as allProperties } from '@/lib/data';
import type { Property } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { ListFilter, RotateCcw, MapPin, Phone } from 'lucide-react';
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

type Filters = {
  price: [number, number];
  propertyType: ('Commercial Space' | 'Office' | 'Showroom' | 'Warehouse')[];
  facing: ('North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West')[];
};

const getDefaultFilters = (): Filters => ({
  price: [1000000, 50000000],
  propertyType: [],
  facing: [],
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

    const handleCheckboxChange = (group: keyof Pick<Filters, 'propertyType' | 'facing'>, value: string, checked: boolean) => {
      const currentValues = filters[group] as string[];
      const newValues = checked ? [...currentValues, value] : currentValues.filter(v => v !== value);
      onFilterChange({ [group]: newValues });
    };

    const content = (
      <>
        <ScrollArea className={isSheet ? 'flex-1' : 'h-full'}>
          <div className="flex flex-col gap-6 p-4">
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
                {(['Commercial Space', 'Office', 'Showroom', 'Warehouse'] as const).map(type => (
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
        </>
    );

    if (isSheet) {
      return (
        <div className="h-full flex flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-lg font-semibold">Filter Properties</SheetTitle>
          </SheetHeader>
          {content}
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
      <Card className="border-0 shadow-none h-full flex flex-col">
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="font-headline text-lg">Filter Properties</CardTitle>
        </CardHeader>
        {content}
         <CardFooter className="p-4 border-t sticky bottom-0 bg-card">
            <Button variant="outline" className="w-full" onClick={clearFilters}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
        </CardFooter>
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
                            <Link href="#">{location}</Link>
                        </Button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                    Click a location to filter properties in that area. (Functionality coming soon).
                </p>
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

export default function CommercialPropertiesPage() {
    const [filters, setFilters] = useState<Filters>(getDefaultFilters());

    const handleFilterChange = (newFilters: Partial<Filters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    };
    
    const clearFilters = () => {
      setFilters(getDefaultFilters());
    };

    const commercialProperties = useMemo(() => {
        let properties = allProperties.filter(p => ['Commercial Space', 'Office', 'Showroom', 'Warehouse'].includes(p.type));
        
        properties = properties.filter(p => p.price >= filters.price[0] && p.price <= filters.price[1]);

        if (filters.propertyType.length > 0) {
            properties = properties.filter(p => filters.propertyType.includes(p.type as any));
        }

        if (filters.facing.length > 0) {
            properties = properties.filter(p => p.facing && filters.facing.includes(p.facing));
        }

        return properties;
    }, [filters]);
  
  return (
    <div className="bg-background">
      <div className="container py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 hidden lg:block">
             <div className="sticky top-24 h-[calc(100vh-7rem)]">
                <FilterSidebar 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  clearFilters={clearFilters}
                />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
             <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-2xl md:text-3xl font-bold">
                        Commercial Properties
                    </h1>
                    <p className="text-muted-foreground text-sm">{commercialProperties.length} results found</p>
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
                {commercialProperties.length > 0 ? (
                  commercialProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                  ))
                ) : (
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
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 h-[calc(100vh-7rem)]">
                <ScrollArea className="h-full">
                    <div className="space-y-6 pr-4">
                        <InsightsSidebar />
                    </div>
                </ScrollArea>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

