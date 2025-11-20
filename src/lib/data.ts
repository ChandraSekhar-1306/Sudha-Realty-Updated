
import type { Property, CommunityListing, ConsultationRequest } from './types';

export const properties: Property[] = [
  
];

export const communityListings: CommunityListing[] = [
  
];


export const consultationRequests: ConsultationRequest[] = [
    {
        id: 'consult-1',
        name: 'Alice Johnson',
        email: 'alice.j@example.com',
        phone: '555-0101',
        message: 'Looking to buy my first home, need guidance on mortgages.',
        status: 'pending',
        createdAt: new Date('2023-10-26T10:00:00Z'),
    },
    {
        id: 'consult-2',
        name: 'Bob Williams',
        email: 'bob.w@example.com',
        phone: '555-0102',
        message: 'I want to invest in a rental property. What are the best areas?',
        status: 'approved',
        createdAt: new Date('2023-10-25T14:30:00Z'),
    },
    {
        id: 'consult-3',
        name: 'Charlie Brown',
        email: 'charlie.b@example.com',
        phone: '555-0103',
        message: 'Interested in selling my current property and upgrading.',
        status: 'rejected',
        createdAt: new Date('2023-10-24T09:00:00Z'),
    },
];

