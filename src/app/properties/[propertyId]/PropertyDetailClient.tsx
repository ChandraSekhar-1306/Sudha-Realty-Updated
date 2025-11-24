
'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Triangle, MapPin, CheckCircle, Share2, ExternalLink, FileText, ArrowLeft, Camera, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Property } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ContactFormDialog } from '@/components/ContactFormDialog';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export function PropertyDetailClient({ property }: { property: Property }) {
  const { toast } = useToast();
  const router = useRouter();

  const validImages = property.images ? property.images.filter(url => url && url.trim() !== '') : [];
  const heroImage = validImages[0];
  const galleryImages = validImages.slice(1);

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: property.description,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied!',
          description: 'Property link has been copied to your clipboard.',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied!',
        description: 'Property link has been copied to your clipboard.',
      });
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) { // 1 Crore
      const value = price / 10000000;
      return `${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
    }
    if (price >= 100000) { // 1 Lakh
      const value = price / 100000;
      return `${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Lakhs`;
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
  };


  const detailItems = [
    { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
    { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
    { icon: Triangle, label: 'sqft', value: property.area.toLocaleString() },
  ].filter(item => item.value);

  return (
    <div className="bg-background">
      <div className="container py-12 sm:py-16">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to results
          </Button>
        </div>

        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
                {property.isFeatured && <Badge>Featured</Badge>}
                {property.saleType && <Badge variant="secondary">{property.saleType}</Badge>}
                {property.isUnderConstruction && <Badge variant="secondary">Under Construction</Badge>}
            </div>
            <h1 className="font-headline text-3xl font-bold">{property.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                <div className='flex items-center gap-2'>
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </div>
               {property.locationUrl && (
                    <Button variant="link" asChild className="p-0 h-auto">
                        <a href={property.locationUrl} target="_blank" rel="noopener noreferrer" className="text-sm">
                            (See on map <ExternalLink className="inline ml-1 h-3 w-3" />)
                        </a>
                    </Button>
                )}
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                </Button>
            </div>
          </div>
          <div className="w-full md:w-auto flex-shrink-0 text-left md:text-right">
                <p className="text-3xl font-bold text-primary">₹ {formatPrice(property.price)}</p>
                <ContactFormDialog propertyTitle={property.title} propertyId={property.id} />
          </div>
        </div>
        
        {/* --- Image Gallery Section --- */}
        <Dialog>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {/* Main Image */}
              <DialogTrigger asChild>
                  <div className="lg:col-span-2 relative h-64 md:h-[28rem] cursor-pointer group">
                  {heroImage && <Image src={heroImage} alt={property.title} fill className="object-cover rounded-lg group-hover:opacity-90 transition-opacity" />}
                  {!heroImage && <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground rounded-lg">No Image</div>}
                  </div>
              </DialogTrigger>
            
            {/* Side Images & Links */}
            <div className="grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-2">
                <DialogTrigger asChild>
                    <div className="relative h-40 md:h-full cursor-pointer group">
                    {galleryImages[0] ? (
                        <Image src={galleryImages[0]} alt={`${property.title} - 1`} fill className="object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground rounded-lg">No Image</div>
                    )}
                    </div>
                </DialogTrigger>

              <div className="grid grid-cols-2 gap-2">
                  <DialogTrigger asChild>
                      <button className="relative h-full w-full bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/80 group">
                          <Camera className="h-6 w-6 mb-1 text-primary"/>
                          <span className='font-semibold'>{validImages.length} Photos</span>
                      </button>
                  </DialogTrigger>

                  <Dialog>
                      <DialogTrigger asChild>
                          <button disabled={!property.floorPlans || property.floorPlans.length === 0} className="relative h-full w-full bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/80 group disabled:cursor-not-allowed disabled:opacity-50">
                              <FileText className="h-6 w-6 mb-1 text-primary"/>
                              <span className='font-semibold'>Floor Plan</span>
                          </button>
                      </DialogTrigger>
                        {/* --- Floor Plans Dialog --- */}
                      <DialogContent className="max-w-4xl">
                          <DialogHeader>
                              <DialogTitle>Floor Plans for {property.title}</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                              {property.floorPlans && property.floorPlans.map((plan, index) => (
                              <a
                                  key={index}
                                  href={plan.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center gap-4 rounded-lg border bg-card p-4 text-card-foreground transition-all hover:bg-muted"
                              >
                                  <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                                  <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="flex-grow">
                                  <p className="font-semibold group-hover:text-primary">{plan.name}</p>
                                  <p className="text-xs text-muted-foreground">Click to view PDF</p>
                                  </div>
                                  <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary" />
                              </a>
                              ))}
                          </div>
                      </DialogContent>
                  </Dialog>
              </div>
            </div>
          </div>
          {/* --- All Photos Dialog --- */}
          <DialogContent className="max-w-4xl p-0">
              <DialogHeader className="p-4 border-b">
                  <DialogTitle>Photos of {property.title}</DialogTitle>
              </DialogHeader>
              <Carousel>
              <CarouselContent>
                  {validImages.map((imgUrl, index) => (
                  <CarouselItem key={index}>
                      <div className="aspect-video relative">
                      <Image src={imgUrl} alt={`${property.title} - Image ${index + 1}`} fill className="object-contain"/>
                      </div>
                  </CarouselItem>
                  ))}
              </CarouselContent>
              {validImages.length > 1 && <><CarouselPrevious className="left-4" /><CarouselNext className="right-4" /></>}
              </Carousel>
          </DialogContent>
        </Dialog>


        {/* --- Details Section --- */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader><CardTitle className="font-headline text-2xl">Property Overview</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {detailItems.map((item) => (
                        <div key={item.label} className="p-4 rounded-lg bg-muted/50">
                        <item.icon className="mx-auto h-7 w-7 text-primary" />
                        <p className="mt-2 font-semibold text-lg">{item.value}</p>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        </div>
                    ))}
                </CardContent>
              </Card>

              {property.isUnderConstruction && property.possessionDate && (
                <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                    <CalendarClock className="h-6 w-6 text-primary flex-shrink-0" />
                    <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className="font-semibold text-base">Possession By:</h3>
                        <p className="text-muted-foreground">{property.possessionDate}</p>
                    </div>
                </div>
              )}

              <Card>
                <CardHeader><CardTitle className="font-headline text-2xl">Description</CardTitle></CardHeader>
                <CardContent><p className="leading-relaxed text-foreground/80">{property.description}</p></CardContent>
              </Card>

              {property.features && property.features.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="font-headline text-2xl">Features & Amenities</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                      {property.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-foreground/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>

       {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm lg:hidden">
        <div className="container flex items-center justify-between gap-4 py-3">
          <div>
            <p className="text-lg font-bold text-primary">₹ {formatPrice(property.price)}</p>
            <p className="text-xs text-muted-foreground">{property.area.toLocaleString()} sqft</p>
          </div>
          <div className="flex gap-2">
            <ContactFormDialog propertyTitle={property.title} propertyId={property.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
