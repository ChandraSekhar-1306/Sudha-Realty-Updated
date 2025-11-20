
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter, useParams, notFound } from 'next/navigation';
import { useEffect, useMemo, Suspense } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { CommunityListing } from '@/lib/types';


const formSchema = z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().min(10, "Description is required"),
    price: z.coerce.number().min(1, "Price is required"),
    deposit: z.coerce.number().min(0).optional(),
    area: z.coerce.number().min(1, "Area is required"),
    location: z.string().min(2, "Location is required"),
    address: z.string().min(5, "Address is required"),
    ownerName: z.string().min(2, "Owner name is required"),
    ownerEmail: z.string().email("A valid email is required"),
    ownerPhone: z.string().min(10, "A valid phone number is required"),
    images: z.string().transform(val => val ? val.split(',').map(s => s.trim()) : []),
    listingType: z.enum(['rent', 'sale']),
    propertyType: z.enum(['Villa', 'Apartment/Gated Community', 'Independent House']),
    bhk: z.enum(['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'N/A']),
    bathrooms: z.coerce.number().min(1),
    furnishing: z.enum(['Fully Furnished', 'Semi-Furnished', 'Unfurnished']),
    parking: z.enum(['2-wheeler', '4-wheeler', 'Both', 'None']),
    preferredTenants: z.enum(['Family', 'Company', 'Male Bachelors', 'Female Bachelors', 'Pure Vegetarian Family', 'Any']),
    facing: z.enum(['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']),
    floor: z.string().min(1),
    waterSupply: z.enum(['Corporation', 'Borewell', 'Both']),
    gatedSecurity: z.enum(['Yes', 'No']),
    petAllowed: z.enum(['Yes', 'No']),
    nonVegAllowed: z.enum(['Yes', 'No']),
});

function EditCommunityListingForm() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const listingId = params.listingId as string;
  const firestore = useFirestore();

  const listingRef = useMemoFirebase(() => {
    if (!firestore || !listingId) return null;
    return doc(firestore, 'community_listings', listingId);
  }, [firestore, listingId]);
  
  const { data: listing, isLoading, error } = useDoc<CommunityListing>(listingRef);

  const defaultValues = useMemo(() => {
    if (!listing) {
      return {
        title: '',
        description: '',
        price: 0,
        deposit: 0,
        area: 0,
        location: '',
        address: '',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        images: '',
        listingType: 'rent' as const,
        propertyType: 'Apartment/Gated Community' as const,
        bhk: '2 BHK' as const,
        bathrooms: 1,
        furnishing: 'Unfurnished' as const,
        parking: 'None' as const,
        preferredTenants: 'Any' as const,
        facing: 'North' as const,
        floor: '',
        waterSupply: 'Both' as const,
        gatedSecurity: 'No' as const,
        petAllowed: 'No' as const,
        nonVegAllowed: 'Yes' as const,
      };
    }
    return {
      ...listing,
      images: Array.isArray(listing.images) ? listing.images.join(', ') : '',
      deposit: listing.deposit ?? 0,
    };
  }, [listing]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !listingId) {
        toast({ title: "Firestore not available or listing ID is missing", variant: "destructive" });
        return;
    }
    const listingToUpdateRef = doc(firestore, 'community_listings', listingId);
    
    updateDoc(listingToUpdateRef, values)
        .then(() => {
            toast({
                title: 'Listing Updated!',
                description: `The listing "${values.title}" has been successfully updated.`,
            });
            router.push('/admin/community-listings');
        })
        .catch((e: any) => {
             const permissionError = new FirestorePermissionError({
                path: listingToUpdateRef.path,
                operation: 'update',
                requestResourceData: values,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive">Error loading listing. It might not exist.</p>
      </div>
    );
  }

  if (!listing && !isLoading) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-4'>
            <Button variant="outline" size="icon" asChild>
                <Link href="/admin/community-listings"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
                <CardTitle>Edit Community Listing</CardTitle>
                <CardDescription>Update the details for the community listing.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form key={listing?.id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Spacious 2BHK in Madhapur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="listingType"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Listing Type</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex space-x-4"
                            >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="rent" />
                                </FormControl>
                                <FormLabel className="font-normal">For Rent</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="sale" />
                                </FormControl>
                                <FormLabel className="font-normal">For Sale</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Apartment/Gated Community">Apartment/Gated Community</SelectItem>
                                <SelectItem value="Independent House">Independent House</SelectItem>
                                <SelectItem value="Villa">Villa</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price/Rent (INR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="deposit" render={({ field }) => (<FormItem><FormLabel>Deposit (INR)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? 0} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="area" render={({ field }) => (<FormItem><FormLabel>Area (sqft)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Madhapur" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Full Address</FormLabel><FormControl><Input placeholder="Full property address" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="bhk" render={({ field }) => (<FormItem><FormLabel>BHK</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select BHK" /></SelectTrigger></FormControl><SelectContent><SelectItem value="1 RK">1 RK</SelectItem><SelectItem value="1 BHK">1 BHK</SelectItem><SelectItem value="2 BHK">2 BHK</SelectItem><SelectItem value="3 BHK">3 BHK</SelectItem><SelectItem value="4+ BHK">4+ BHK</SelectItem><SelectItem value="N/A">N/A</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="bathrooms" render={({ field }) => (<FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="floor" render={({ field }) => (<FormItem><FormLabel>Floor</FormLabel><FormControl><Input placeholder="e.g., 3/5 or Ground" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <FormField control={form.control} name="furnishing" render={({ field }) => (<FormItem><FormLabel>Furnishing</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select furnishing" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Fully Furnished">Fully Furnished</SelectItem><SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem><SelectItem value="Unfurnished">Unfurnished</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="parking" render={({ field }) => (<FormItem><FormLabel>Parking</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select parking" /></SelectTrigger></FormControl><SelectContent><SelectItem value="2-wheeler">2-wheeler</SelectItem><SelectItem value="4-wheeler">4-wheeler</SelectItem><SelectItem value="Both">Both</SelectItem><SelectItem value="None">None</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="facing" render={({ field }) => (<FormItem><FormLabel>Facing</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select direction" /></SelectTrigger></FormControl><SelectContent><SelectItem value="North">North</SelectItem><SelectItem value="South">South</SelectItem><SelectItem value="East">East</SelectItem><SelectItem value="West">West</SelectItem><SelectItem value="North-East">North-East</SelectItem><SelectItem value="North-West">North-West</SelectItem><SelectItem value="South-East">South-East</SelectItem><SelectItem value="South-West">South-West</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="preferredTenants" render={({ field }) => (<FormItem><FormLabel>Preferred Tenants</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select preferred tenants" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Family">Family</SelectItem><SelectItem value="Company">Company</SelectItem><SelectItem value="Male Bachelors">Male Bachelors</SelectItem><SelectItem value="Female Bachelors">Female Bachelors</SelectItem><SelectItem value="Pure Vegetarian Family">Pure Vegetarian Family</SelectItem><SelectItem value="Any">Any</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="waterSupply" render={({ field }) => (<FormItem><FormLabel>Water Supply</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select water supply" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Corporation">Corporation</SelectItem><SelectItem value="Borewell">Borewell</SelectItem><SelectItem value="Both">Both</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="gatedSecurity" render={({ field }) => (<FormItem><FormLabel>Gated Security</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="petAllowed" render={({ field }) => (<FormItem><FormLabel>Pet Allowed</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="nonVegAllowed" render={({ field }) => (<FormItem><FormLabel>Non-Veg Allowed</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            </div>

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URLs</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of image URLs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="ownerName" render={({ field }) => (<FormItem><FormLabel>Owner Name</FormLabel><FormControl><Input placeholder="Owner Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="ownerEmail" render={({ field }) => (<FormItem><FormLabel>Owner Email</FormLabel><FormControl><Input placeholder="owner@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="ownerPhone" render={({ field }) => (<FormItem><FormLabel>Owner Phone</FormLabel><FormControl><Input placeholder="+91 12345 67890" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>


            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Updating...' : 'Update Community Listing'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function EditCommunityListingPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <EditCommunityListingForm />
        </Suspense>
    )
}
