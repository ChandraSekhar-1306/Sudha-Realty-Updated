
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  locationUrl?: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  type: 'Apartment' | 'Villa' | 'Open Plot' | 'Farmland' | 'Commercial Space' | 'Office' | 'Showroom' | 'Warehouse';
  images: string[];
  isFeatured?: boolean;
  facing?: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  saleType?: 'Fresh Sales' | 'Resales';
  features?: string[];
  floorPlans?: { name: string; url: string; }[];
}

export interface CommunityListing {
  id: string;
  title: string;
  description: string;
  price: number;
  deposit: number;
  area: number;
  location: string;
  address: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  images: string[];
  listingType: 'rent' | 'sale';
  propertyType: 'Villa' | 'Apartment/Gated Community' | 'Independent House';
  bhk: '1 RK' | '1 BHK' | '2 BHK' | '3 BHK' | '4+ BHK' | 'N/A';
  bathrooms: number;
  furnishing: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';
  parking: '2-wheeler' | '4-wheeler' | 'Both' | 'None';
  preferredTenants: 'Family' | 'Company' | 'Male Bachelors' | 'Female Bachelors' | 'Pure Vegetarian Family' | 'Any';
  facing: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  floor: string;
  waterSupply: 'Corporation' | 'Borewell' | 'Both';
  gatedSecurity: 'Yes' | 'No';
  petAllowed: 'Yes' | 'No';
  nonVegAllowed: 'Yes' | 'No';
}

export interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export interface CommunityInquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  userName: string;
  userPhone: string;
  reason: 'Investment' | 'Self Use';
  isDealer: 'Yes' | 'No';
  createdAt: Date;
}
