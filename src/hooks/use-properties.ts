'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Property } from '@/lib/types';

export function useProperties() {
  const firestore = useFirestore();
  const propertiesCol = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'properties');
  }, [firestore]);

  const { data: properties, isLoading, error } = useCollection<Property>(propertiesCol);

  return { properties, isLoading, error };
}
