
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { CommunityListing } from '@/lib/types';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bed,
  Triangle,
  MapPin,
  Heart,
  Users,
  Armchair,
  Car,
  ExternalLink,
  Phone,
  Building,
} from 'lucide-react';
import { OwnerContactDialog } from './OwnerContactDialog';

interface CommunityListingCardProps {
  listing: CommunityListing;
}

export function CommunityListingCard({ listing }: CommunityListingCardProps) {
  const currencyFormatter = new Intl.NumberFormat('en-IN', {
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
    value: string;
  }) => (
    <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-muted-foreground" />
        <div className='text-left'>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-semibold">{value}</p>
        </div>
    </div>
  );

  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg bg-card">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image Carousel */}
        <div className="md:col-span-1">
          <Carousel className="w-full rounded-lg overflow-hidden relative">
            <CarouselContent>
              {(listing.images || []).map((imageUrl, index) => {
                return (
                  <CarouselItem key={index}>
                    <Image
                      src={imageUrl}
                      alt={`${listing.title} - Image ${index + 1}`}
                      width={400}
                      height={300}
                      className="aspect-video w-full object-cover"
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-background/50 hover:bg-background/80" />
            <CarouselNext className="right-2 bg-background/50 hover:bg-background/80" />
          </Carousel>
        </div>

        {/* Main Info */}
        <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold hover:text-primary transition-colors">
                    <Link href={`/community-listings/${listing.id}`}>
                    {listing.bhk} {listing.propertyType} in {listing.location}
                    </Link>
                </h3>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Heart className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <MapPin className="h-3.5 w-3.5" /> {listing.address}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4 border-y py-4">
            <InfoItem
              icon={Triangle}
              label="Builtup Area"
              value={`${listing.area.toLocaleString()} sqft`}
            />
            <InfoItem
              icon={Bed}
              label={listing.listingType === 'rent' ? 'Monthly Rent' : 'Price'}
              value={`${currencyFormatter.format(listing.price)}`}
            />
            <InfoItem
              icon={Wallet}
              label="Deposit"
              value={currencyFormatter.format(listing.deposit)}
            />
             <InfoItem icon={Armchair} label="Furnishing" value={listing.furnishing} />
            <InfoItem icon={Building} label="BHK" value={listing.bhk} />
            <InfoItem icon={Users} label="Preferred Tenants" value={listing.preferredTenants} />
            <InfoItem icon={Car} label="Parking" value={`${listing.parking}`} />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
             <OwnerContactDialog 
                listingId={listing.id}
                listingTitle={listing.title}
                ownerName={listing.ownerName}
                ownerEmail={listing.ownerEmail}
                ownerPhone={listing.ownerPhone}
              />
            <Button asChild variant="outline" className="w-full sm:w-auto flex-1">
                <Link href={`/community-listings/${listing.id}`}>
                    View Details <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

// Dummy icon, replace if you have a wallet icon
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
