
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/server-init';
import type { Property } from '@/lib/types';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { PropertyDetailClient } from './PropertyDetailClient';

// This special function in Next.js generates metadata for the page.
// It's a Server Component function, so we can fetch data directly.
export async function generateMetadata(
  { params }: { params: { propertyId: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { propertyId } = params;
  const { firestore } = initializeFirebase();
  
  const propertyRef = doc(firestore, 'properties', propertyId);
  const propertySnap = await getDoc(propertyRef);

  if (!propertySnap.exists()) {
    return {
      title: 'Property Not Found',
    }
  }

  const property = propertySnap.data() as Property;

  // We can optionally resolve parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${property.title} | Sudha Realty`,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: [
        {
          url: property.images[0], // Use the first image as the preview
          width: 1200,
          height: 630,
          alt: property.title,
        },
        // ...previousImages, // You could also include parent images
      ],
    },
  }
}

async function getProperty(propertyId: string): Promise<Property | null> {
  const { firestore } = initializeFirebase();
  const propertyRef = doc(firestore, 'properties', propertyId);
  const propertySnap = await getDoc(propertyRef);

  if (!propertySnap.exists()) {
    return null;
  }
  return { id: propertySnap.id, ...propertySnap.data() } as Property;
}

export default async function PropertyDetailPage({ params }: { params: { propertyId: string } }) {
  const property = await getProperty(params.propertyId);

  if (!property) {
    notFound();
  }

  return <PropertyDetailClient property={property} />;
}
