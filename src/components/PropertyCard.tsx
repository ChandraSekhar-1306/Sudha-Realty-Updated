
import Image from 'next/image';
import Link from 'next/link';
import type { Property } from '@/lib/types';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bed, Bath, Triangle, MapPin, ExternalLink, Phone, Compass } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from '@/components/ui/carousel';
import { ContactFormDialog } from './ContactFormDialog';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value?: string | number;
  }) => {
    if (!value) return null;
    return (
        <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-muted-foreground" />
            <div className='text-left'>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
            </div>
        </div>
    );
  };

  const validImages = property.images.filter(url => url && url.trim() !== '');

  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg bg-card">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image Carousel */}
        <div className="md:col-span-1">
          <Carousel className="w-full rounded-lg overflow-hidden relative">
            <CarouselContent>
              {validImages.length > 0 ? (
                validImages.map((imageUrl, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={imageUrl}
                      alt={`${property.title} - Image ${index + 1}`}
                      width={400}
                      height={300}
                      className="aspect-video w-full object-cover"
                    />
                  </CarouselItem>
                ))
              ) : (
                 <CarouselItem>
                    <div className="aspect-video w-full bg-muted flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">No Image</span>
                    </div>
                </CarouselItem>
              )}
            </CarouselContent>
            {validImages.length > 1 && (
                <>
                    <CarouselPrevious className="left-2 bg-background/50 hover:bg-background/80" />
                    <CarouselNext className="right-2 bg-background/50 hover:bg-background/80" />
                </>
            )}
            
            <div className='absolute top-2 right-2 z-10 flex flex-col items-end gap-1'>
              {property.isFeatured && 
                  <Badge>Featured</Badge>
              }
              {property.saleType &&
                  <Badge variant="secondary">{property.saleType}</Badge>
              }
            </div>
          </Carousel>
        </div>

        {/* Main Info */}
        <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
          <div>
            <div className='flex justify-between items-start'>
                <Badge variant="outline" className="mb-2">{property.type}</Badge>
                <div className="text-2xl font-bold text-primary">
                  {formatter.format(property.price)}
                </div>
            </div>
            <h3 className="text-lg font-bold hover:text-primary transition-colors">
                <Link href={`/properties/${property.id}`}>
                {property.title}
                </Link>
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <MapPin className="h-3.5 w-3.5" /> {property.location}
            </p>
          </div>
            
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-2 border-y py-4">
            <InfoItem icon={Bed} label="Bedrooms" value={property.bedrooms} />
            <InfoItem icon={Bath} label="Bathrooms" value={property.bathrooms} />
            <InfoItem icon={Triangle} label="Area" value={property.area ? `${property.area.toLocaleString()} sqft` : undefined} />
            <InfoItem icon={Compass} label="Facing" value={property.facing} />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <ContactFormDialog propertyTitle={property.title} propertyId={property.id} />
            <Button asChild variant="outline" className="w-full sm:w-auto flex-1">
                <Link href={`/properties/${property.id}`}>
                    View Details <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
