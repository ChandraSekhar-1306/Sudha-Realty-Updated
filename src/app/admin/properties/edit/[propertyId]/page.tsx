
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
import { Checkbox } from '@/components/ui/checkbox';
import { useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { Property } from '@/lib/types';


const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().min(1, 'Price is required.'),
  location: z.string().min(2, 'Location is required.'),
  locationUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  area: z.coerce.number().min(1, 'Area is required.'),
  type: z.enum(['Apartment', 'Villa', 'Open Plot', 'Farmland', 'Commercial Space', 'Office', 'Showroom', 'Warehouse']),
  isFeatured: z.boolean().default(false),
  facing: z.enum(['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']).optional().nullable(),
  images: z.string().transform(val => val ? val.split(',').map(s => s.trim()) : []),
  features: z.string().transform(val => val ? val.split(',').map(s => s.trim()) : []).optional(),
  saleType: z.enum(['Fresh Sales', 'Resales']).optional().nullable(),
});

function EditPropertyForm() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const propertyId = params.propertyId as string;
  const firestore = useFirestore();

  const propertyRef = useMemoFirebase(() => {
    if (!firestore || !propertyId) return null;
    return doc(firestore, 'properties', propertyId);
  }, [firestore, propertyId]);
  
  const { data: property, isLoading, error } = useDoc<Property>(propertyRef);

  const defaultValues = useMemo(() => {
    if (!property) {
      return {
        title: '',
        description: '',
        location: '',
        locationUrl: '',
        isFeatured: false,
        images: '',
        features: '',
        price: 0,
        area: 0,
        bedrooms: 0,
        bathrooms: 0,
        type: 'Apartment' as const,
        facing: null,
        saleType: null,
      };
    }
    return {
      ...property,
      images: Array.isArray(property.images) ? property.images.join(', ') : '',
      features: Array.isArray(property.features) ? property.features.join(', ') : '',
      bedrooms: property.bedrooms ?? 0,
      bathrooms: property.bathrooms ?? 0,
      facing: property.facing ?? null,
      saleType: property.saleType ?? null,
      locationUrl: property.locationUrl ?? '',
    };
  }, [property]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !propertyId) {
        toast({ title: "Firestore not available or property ID is missing", variant: "destructive" });
        return;
    }
    const propertyToUpdateRef = doc(firestore, 'properties', propertyId);
    
    const updateData = {
      ...values,
      features: values.features || [],
    };
    
    updateDoc(propertyToUpdateRef, updateData)
        .then(() => {
            toast({
                title: 'Property Updated!',
                description: `The property "${values.title}" has been successfully updated.`,
            });
            router.push('/admin/properties');
        })
        .catch((e: any) => {
             const permissionError = new FirestorePermissionError({
                path: propertyToUpdateRef.path,
                operation: 'update',
                requestResourceData: updateData,
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
        <p className="text-destructive">Error loading property. It might not exist.</p>
      </div>
    );
  }

  if (!property && !isLoading) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-4'>
            <Button variant="outline" size="icon" asChild>
                <Link href="/admin/properties"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
                <CardTitle>Edit Curated Property</CardTitle>
                <CardDescription>Update the details for the property listing.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form key={defaultValues.id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Modern 4BHK Villa" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Jubilee Hills, Hyderabad" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="locationUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://maps.app.goo.gl/..." {...field} value={field.value ?? ''} />
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
                    <Textarea
                      placeholder="Detailed description of the property..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (INR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 18000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (sqft)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a property type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="Villa">Villa</SelectItem>
                            <SelectItem value="Open Plot">Open Plot</SelectItem>
                            <SelectItem value="Farmland">Farmland</SelectItem>
                            <SelectItem value="Commercial Space">Commercial Space</SelectItem>
                            <SelectItem value="Office">Office</SelectItem>
                             <SelectItem value="Showroom">Showroom</SelectItem>
                            <SelectItem value="Warehouse">Warehouse</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 4" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 3" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="facing"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Facing</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="North">North</SelectItem>
                            <SelectItem value="South">South</SelectItem>
                            <SelectItem value="East">East</SelectItem>
                            <SelectItem value="West">West</SelectItem>
                            <SelectItem value="North-East">North-East</SelectItem>
                            <SelectItem value="North-West">North-West</SelectItem>
                            <SelectItem value="South-East">South-East</SelectItem>
                            <SelectItem value="South-West">South-West</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="saleType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Sale Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select sale type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Fresh Sales">Fresh Sales</SelectItem>
                                <SelectItem value="Resales">Resales</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
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
             <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Swimming Pool, Gym, Gated Community"
                      {...field}
                       value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of property features or amenities.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Feature this property
                      </FormLabel>
                      <FormDescription>
                        Featured properties will be highlighted on the website.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Updating...' : 'Update Property'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function EditPropertyPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <EditPropertyForm />
        </Suspense>
    )
}
