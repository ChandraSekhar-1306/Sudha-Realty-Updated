'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { CommunityListing } from '@/lib/types';

export function useCommunityListings() {
  const firestore = useFirestore();
  const listingsCol = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'community_listings');
  }, [firestore]);

  const { data: listings, isLoading, error } = useCollection<CommunityListing>(listingsCol);

  return { listings, isLoading, error };
}
