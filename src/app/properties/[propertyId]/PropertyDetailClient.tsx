
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Triangle, MapPin, CheckCircle, Share2, Copy, ExternalLink, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import type { Property } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ContactFormDialog } from '@/components/ContactFormDialog';

export function PropertyDetailClient({ property }: { property: Property }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };
  
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
        // Fallback for browsers that do not support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied!',
          description: 'Property link has been copied to your clipboard.',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback for when sharing fails
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied!',
        description: 'Property link has been copied to your clipboard.',
      });
    }
  };


  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const detailItems = [
    { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
    { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
    { icon: Triangle, label: 'sqft', value: property.area.toLocaleString() },
  ].filter(item => item.value);

  return (
    <div className="bg-background">
      <div className="container py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <Carousel className="w-full overflow-hidden rounded-lg shadow-lg" setApi={setApi}>
                <CarouselContent>
                  {property.images.map((imageUrl, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={imageUrl}
                        alt={`${property.title} - Image ${index + 1}`}
                        width={1200}
                        height={800}
                        className="aspect-[3/2] h-auto w-full object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
              <div className="grid grid-cols-6 gap-2">
                {property.images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative aspect-video cursor-pointer overflow-hidden rounded-md border-2",
                      (current - 1) === index ? "border-primary" : "border-transparent"
                    )}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover transition-opacity hover:opacity-80"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-4 lg:hidden">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-headline text-3xl font-bold">{property.title}</h1>
                  <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-4 shrink-0">{property.type}</Badge>
              </div>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-foreground/80">{property.description}</p>
              </CardContent>
            </Card>

            {property.features && property.features.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Features & Amenities</CardTitle>
                </CardHeader>
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

            {property.floorPlans && property.floorPlans.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Floor Plans</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {property.floorPlans.map((plan, index) => (
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
                        <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary"/>
                      </a>
                    ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 hidden lg:block">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-headline text-3xl font-bold">{property.title}</h1>
                    <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-4 shrink-0">{property.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="my-4">
                  <p className="text-4xl font-bold text-primary">{formatter.format(property.price)}</p>
                </div>
                <div className="my-6 grid grid-cols-3 gap-4 border-y py-4 text-center">
                  {detailItems.map((item) => (
                    <div key={item.label}>
                      <item.icon className="mx-auto h-6 w-6 text-primary" />
                      <p className="mt-1 font-semibold">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
                <h3 className="mb-3 font-headline text-lg font-semibold">Key Details</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Property ID:</span>
                    <span className="font-medium">{property.id}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{property.type}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Sale Type:</span>
                    <span className="font-medium">{property.saleType}</span>
                  </li>
                   {property.locationUrl && (
                    <li className="flex justify-between items-center">
                        <span className="text-muted-foreground">Location:</span>
                        <Button variant="link" asChild className="p-0 h-auto">
                            <a href={property.locationUrl} target="_blank" rel="noopener noreferrer">
                                View on Map <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </Button>
                    </li>
                  )}
                </ul>
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-2 pt-6">
                <div className="flex gap-2">
                    <ContactFormDialog propertyTitle={property.title} propertyId={property.id} />
                    <Button size="lg" variant="outline" className="px-3" onClick={handleShare}>
                        <Share2 className="h-5 w-5" />
                        <span className="sr-only">Share</span>
                    </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm lg:hidden">
        <div className="container flex items-center justify-between gap-4 py-3">
          <div>
            <p className="text-lg font-bold text-primary">{formatter.format(property.price)}</p>
            <p className="text-xs text-muted-foreground">{property.area.toLocaleString()} sqft</p>
          </div>
          <div className="flex gap-2">
            <ContactFormDialog propertyTitle={property.title} propertyId={property.id} />
             <Button variant="outline" className="px-3" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
