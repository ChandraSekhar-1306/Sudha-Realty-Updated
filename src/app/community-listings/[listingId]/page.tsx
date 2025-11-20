
'use client';

import React, { useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bed,
  Triangle,
  MapPin,
  Users,
  Armchair,
  Car,
  Phone,
  Building,
  Bath,
  Compass,
  Layers,
  Droplets,
  Dog,
  ShieldCheck,
  UtensilsCrossed,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { CommunityListing } from '@/lib/types';
import { OwnerContactDialog } from '@/components/OwnerContactDialog';


const Wallet = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12V7H5a2 2 0 0 1-2-2V3h14a2 2 0 0 1 2 2v2" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-9" />
    <path d="M16 16h2" />
  </svg>
);


const DetailItem = ({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) => (
    <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold text-foreground">{value}</p>
        </div>
    </div>
);


export default function CommunityListingDetailPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const listingId = params.listingId as string;
  
  const firestore = useFirestore();

  const listingRef = useMemoFirebase(() => {
    if (!firestore || !listingId) return null;
    return doc(firestore, 'community_listings', listingId);
  }, [firestore, listingId]);

  const { data: listing, isLoading, error } = useDoc<CommunityListing>(listingRef);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing && !isLoading) {
    notFound();
  }

  if (!listing) return null;

  const images = listing.images || [];
  const heroImage = images[0];
  const galleryImages = images.slice(1);

  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const propertyDetails = [
    { label: 'Builtup Area', value: `${listing.area.toLocaleString()} sqft`, icon: Triangle },
    { label: 'BHK', value: listing.bhk, icon: Building },
    { label: 'Bathrooms', value: String(listing.bathrooms), icon: Bath },
    { label: 'Furnishing', value: listing.furnishing, icon: Armchair },
    { label: 'Parking', value: listing.parking, icon: Car },
    { label: 'Preferred Tenants', value: listing.preferredTenants, icon: Users },
    { label: 'Deposit', value: currencyFormatter.format(listing.deposit), icon: Wallet },
    { label: 'Facing', value: listing.facing, icon: Compass },
    { label: 'Floor', value: listing.floor, icon: Layers },
    { label: 'Water Supply', value: listing.waterSupply, icon: Droplets },
    { label: 'Pet Allowed', value: listing.petAllowed, icon: Dog },
    { label: 'Gated Security', value: listing.gatedSecurity, icon: ShieldCheck },
    { label: 'Non-Veg Allowed', value: listing.nonVegAllowed, icon: UtensilsCrossed },
  ];

  return (
    <div className="bg-background">
      <div className="container py-12 sm:py-16">
        <div className="mb-8">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Listings
            </Button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-4">
                <Badge variant="secondary" className="mb-2 w-fit-content">{listing.propertyType}</Badge>
                <h1 className="font-headline text-3xl font-bold">
                  {listing.bhk} {listing.propertyType} in {listing.location}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.address}</span>
                </div>
              </div>
            
            <DialogTrigger asChild>
                <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[24rem] cursor-pointer group">
                    <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg">
                        {heroImage && (
                            <Image src={heroImage} alt={listing.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300"/>
                        )}
                    </div>
                    {galleryImages.slice(0, 2).map((imageUrl, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg">
                            <Image src={imageUrl} alt={`${listing.title} - ${index + 2}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300"/>
                        </div>
                    ))}
                    {galleryImages.length > 2 && (
                         <div className="relative overflow-hidden rounded-lg">
                             <Image src={galleryImages[2]} alt={`${listing.title} - 4`} fill className="object-cover group-hover:scale-105 transition-transform duration-300"/>
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                 <span className="text-white font-bold text-2xl">+{images.length - 3}</span>
                             </div>
                         </div>
                    )}
                     {galleryImages.length <= 2 && galleryImages.length > 1 && (
                         <div className="relative overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                           <Button variant="outline">View All Photos</Button>
                         </div>
                    )}
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-4xl p-0">
                <DialogHeader>
                    <DialogTitle className="sr-only">Image Gallery for {listing.title}</DialogTitle>
                </DialogHeader>
                <Carousel>
                    <CarouselContent>
                        {images.map((imgUrl, index) => (
                            <CarouselItem key={index}>
                                <div className="aspect-video relative">
                                    <Image
                                        src={imgUrl}
                                        alt={`${listing.title} - Image ${index + 1}`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                </Carousel>
            </DialogContent>
            
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">
                    Property Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {propertyDetails.map(detail => (
                        <DetailItem key={detail.label} {...detail} />
                    ))}
                </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-foreground/80">
                  {listing.description}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="my-4">
                  <p className="text-4xl font-bold text-primary">
                    {currencyFormatter.format(listing.price)}
                    {listing.listingType === 'rent' && <span className="text-xl font-medium text-muted-foreground">/month</span>}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                    Contact the owner directly to schedule a visit or ask questions.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <OwnerContactDialog 
                  listingId={listing.id}
                  listingTitle={listing.title}
                  ownerName={listing.ownerName}
                  ownerEmail={listing.ownerEmail}
                  ownerPhone={listing.ownerPhone}
                />
                 <p className="text-xs text-muted-foreground text-center w-full">
                    You'll be connected directly with the property owner.
                 </p>
              </CardFooter>
            </Card>
          </div>
        </div>
        </Dialog>
      </div>
    </div>
  );
}
