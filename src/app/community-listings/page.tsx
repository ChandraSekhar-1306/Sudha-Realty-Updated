
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { CommunityListing } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ListFilter, Info, RotateCcw, Loader2, Mail, Phone, FilePlus2 } from 'lucide-react';
import { CommunityListingCard } from '@/components/CommunityListingCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCommunityListings } from '@/hooks/use-community-listings';
import Link from 'next/link';

type ListingType = 'rent' | 'sale';

const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'] as const;
const PROPERTY_TYPE_OPTIONS = ['Apartment/Gated Community', 'Independent House', 'Villa'] as const;
const TENANT_OPTIONS = ['Family', 'Company', 'Male Bachelors', 'Female Bachelors', 'Pure Vegetarian Family', 'Any'] as const;
const PARKING_OPTIONS = ['any', '2-wheeler', '4-wheeler', 'both'] as const;

type Filters = {
  price: [number, number];
  bhk: (typeof BHK_OPTIONS[number])[];
  propertyType: (typeof PROPERTY_TYPE_OPTIONS[number])[];
  tenants: (typeof TENANT_OPTIONS[number])[];
  parking: typeof PARKING_OPTIONS[number];
};

const priceRanges = {
  rent: { min: 5000, max: 50000, step: 1000 },
  sale: { min: 2000000, max: 20000000, step: 100000 }
};

const getDefaultFilters = (listingType: ListingType): Filters => ({
  price: [listingType === 'rent' ? priceRanges.rent.min : priceRanges.sale.min, listingType === 'rent' ? priceRanges.rent.max : priceRanges.sale.max],
  bhk: [],
  propertyType: [],
  tenants: [],
  parking: 'any',
});

const FilterSidebar = ({ 
  filters, 
  onFilterChange, 
  listingType, 
  setListingType,
  clearFilters
}: { 
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  listingType: ListingType;
  setListingType: (type: ListingType) => void;
  clearFilters: () => void;
}) => {
    
    const currencyFormatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const handleCheckboxChange = (group: keyof Pick<Filters, 'bhk' | 'propertyType' | 'tenants'>, value: string, checked: boolean) => {
      const currentValues = filters[group] as string[];
      const newValues = checked ? [...currentValues, value] : currentValues.filter(v => v !== value);
      onFilterChange({ [group]: newValues });
    };

    const content = (
      <Card className="border-0 shadow-none h-full flex flex-col bg-transparent">
        <CardHeader className="px-4 pt-0 pb-2">
          <CardTitle className="font-headline text-lg">Filter Properties</CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1">
          <CardContent className="flex flex-col gap-6 p-4 pt-0">
              <div className="space-y-4">
                  <Label>Listing Type</Label>
                  <Tabs defaultValue={listingType} onValueChange={(value) => setListingType(value as ListingType)} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="rent">For Rent</TabsTrigger>
                          <TabsTrigger value="sale">For Sale</TabsTrigger>
                      </TabsList>
                  </Tabs>
              </div>

              <Accordion type="multiple" defaultValue={['price', 'bhk', 'propertyType']} className="w-full space-y-4">
                <AccordionItem value="price">
                    <AccordionTrigger className="font-semibold text-base py-2">
                    {listingType === 'rent' ? 'Monthly Rent' : 'Sale Price'}
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                        <Slider
                            value={filters.price}
                            onValueChange={(newPrice) => onFilterChange({ price: newPrice as [number, number] })}
                            min={listingType === 'rent' ? priceRanges.rent.min : priceRanges.sale.min}
                            max={listingType === 'rent' ? priceRanges.rent.max : priceRanges.sale.max}
                            step={listingType === 'rent' ? priceRanges.rent.step : priceRanges.sale.step}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{currencyFormatter.format(filters.price[0])}</span>
                            <span>{currencyFormatter.format(filters.price[1])}</span>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="bhk">
                    <AccordionTrigger className="font-semibold text-base py-2">BHK Type</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-3">
                    {BHK_OPTIONS.map(bhk => (
                        <div key={bhk} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`bhk-${bhk}`} 
                          checked={filters.bhk.includes(bhk)}
                          onCheckedChange={(checked) => handleCheckboxChange('bhk', bhk, !!checked)}
                        />
                        <Label htmlFor={`bhk-${bhk}`} className="font-normal">{bhk}</Label>
                        </div>
                    ))}
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="propertyType">
                    <AccordionTrigger className="font-semibold text-base py-2">Property Type</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-3">
                    {PROPERTY_TYPE_OPTIONS.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`type-${type}`} 
                          checked={filters.propertyType.includes(type)}
                          onCheckedChange={(checked) => handleCheckboxChange('propertyType', type, !!checked)}
                        />
                        <Label htmlFor={`type-${type}`} className="font-normal">{type}</Label>
                        </div>
                    ))}
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="tenants">
                    <AccordionTrigger className="font-semibold text-base py-2">Preferred Tenants</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-3">
                    {TENANT_OPTIONS.map(tenant => (
                        <div key={tenant} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`tenant-${tenant}`} 
                          checked={filters.tenants.includes(tenant)}
                          onCheckedChange={(checked) => handleCheckboxChange('tenants', tenant, !!checked)}
                        />
                        <Label htmlFor={`tenant-${tenant}`} className="font-normal">{tenant}</Label>
                        </div>
                    ))}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="parking">
                    <AccordionTrigger className="font-semibold text-base py-2">Parking</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-3">
                        <RadioGroup 
                          value={filters.parking} 
                          onValueChange={(value) => onFilterChange({ parking: value as typeof PARKING_OPTIONS[number] })}
                        >
                            {PARKING_OPTIONS.map(opt => (
                              <div key={opt} className="flex items-center space-x-2">
                                  <RadioGroupItem value={opt} id={`parking-${opt}`} />
                                  <Label htmlFor={`parking-${opt}`} className="font-normal capitalize">{opt}</Label>
                              </div>
                            ))}
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>
              </Accordion>
          </CardContent>
         </ScrollArea>
         <CardFooter className="p-4 pt-0 border-t sticky bottom-0 bg-card">
            <Button variant="outline" className="w-full" onClick={clearFilters}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
        </CardFooter>
      </Card>
    );
    return content;
};


export default function CommunityListingsPage() {
    const [listingType, setListingType] = useState<ListingType>('rent');
    const [filters, setFilters] = useState<Filters>(getDefaultFilters('rent'));
    const { listings: allListings, isLoading, error } = useCommunityListings();

    const handleListingTypeChange = (type: ListingType) => {
      setListingType(type);
      setFilters(getDefaultFilters(type));
    };

    const handleFilterChange = (newFilters: Partial<Filters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    };
    
    const clearFilters = useCallback(() => {
      setFilters(getDefaultFilters(listingType));
    }, [listingType]);

    useEffect(() => {
      setFilters(getDefaultFilters(listingType));
    }, [listingType]);

    const filteredListings = useMemo(() => {
        if (!allListings) return [];
        
        let listings = allListings.filter(listing => listing.listingType === listingType);
        
        listings = listings.filter(l => l.price >= filters.price[0] && l.price <= filters.price[1]);

        if (filters.bhk.length > 0) {
            listings = listings.filter(l => filters.bhk.includes(l.bhk));
        }
        
        if (filters.propertyType.length > 0) {
            listings = listings.filter(l => filters.propertyType.includes(l.propertyType));
        }

        if (filters.tenants.length > 0 && !filters.tenants.includes('Any')) {
            listings = listings.filter(l => filters.tenants.includes(l.preferredTenants));
        }

        if (filters.parking !== 'any') {
            if (filters.parking === 'both') {
                 listings = listings.filter(l => l.parking === 'Both');
            } else if (filters.parking === '2-wheeler') {
                 listings = listings.filter(l => l.parking === '2-wheeler' || l.parking === 'Both');
            } else if (filters.parking === '4-wheeler') {
                 listings = listings.filter(l => l.parking === '4-wheeler' || l.parking === 'Both');
            }
        }

        return listings;
    }, [listingType, filters, allListings]);
  
  return (
    <div className="bg-muted/40">
      <div className="w-full min-h-screen lg:grid lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block bg-background border-r">
             <div className="sticky top-0 h-screen flex flex-col pt-32">
                <FilterSidebar 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  listingType={listingType} 
                  setListingType={handleListingTypeChange}
                  clearFilters={clearFilters}
                />
            </div>
          </aside>

          {/* Main Content */}
          <main className="py-8 px-4 sm:px-6 lg:px-8 pt-32">
             <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-2xl md:text-3xl font-bold">
                        Properties For {listingType === 'rent' ? 'Rent' : 'Sale'}
                    </h1>
                    <p className="text-muted-foreground text-sm">{filteredListings.length} results found</p>
                </div>

                 <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden">
                            <ListFilter className="h-4 w-4" />
                            <span className="sr-only">Filters</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-sm p-0">
                        <SheetTitle className="sr-only">Filter Properties</SheetTitle>
                        <FilterSidebar 
                          filters={filters}
                          onFilterChange={handleFilterChange}
                          listingType={listingType} 
                          setListingType={handleListingTypeChange}
                          clearFilters={clearFilters}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/50 dark:text-amber-200 [&>svg]:text-amber-500 dark:[&gt;svg]:text-amber-400">
                <Info className="h-5 w-5" />
                <AlertTitle className="font-bold">Important Notice</AlertTitle>
                <AlertDescription className="text-xs text-amber-800 dark:text-amber-300">
                    Properties in this section are independently listed by owners. Sudha Realty provides the platform but does not manage or verify these listings. All inquiries and transactions are directly between property owners and interested parties.
                </AlertDescription>
            </Alert>
            
             <Card className="mb-6">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary flex-shrink-0">
                            <FilePlus2 className="size-8" />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-bold">List Your Property With Us</h3>
                            <p className="text-muted-foreground mt-1 max-w-lg">
                                Reach thousands of potential buyers and tenants by listing your property on our platform. Contact us to get started.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                        <Button variant="outline" asChild>
                           <a href="tel:+919381303558" className="flex items-center gap-2">
                             <Phone className="size-4" />+91 9381303558
                           </a>
                        </Button>
                         <Button asChild>
                           <a href="mailto:admin@sudharealty.in">
                             <Mail className="size-4 mr-2" />Email Us
                           </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>


            <div className="space-y-6">
                {isLoading && (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {error && (
                  <Card className="text-center py-12 bg-destructive/10 border-destructive">
                    <CardContent>
                      <h3 className='text-xl font-semibold text-destructive'>Error loading listings</h3>
                      <p className='text-muted-foreground mt-2'>There was an issue fetching data from the server.</p>
                    </CardContent>
                  </Card>
                )}
                {!isLoading && !error && filteredListings.length > 0 && (
                  filteredListings.map((listing) => (
                      <CommunityListingCard key={listing.id} listing={listing} />
                  ))
                )}
                 {!isLoading && !error && filteredListings.length === 0 && (
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
        </div>
    </div>
  );
}

    

    