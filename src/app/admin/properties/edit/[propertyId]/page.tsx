
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { useRouter, useParams, notFound } from 'next/navigation';
import React, { useEffect, useMemo, Suspense } from 'react';

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
import { ArrowLeft, Loader2, Wand2, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Property } from '@/lib/types';
import { cn } from '@/lib/utils';


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
  floorPlans: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    url: z.string().url("A valid URL is required"),
  })).optional(),
  isUnderConstruction: z.boolean().default(false),
  possessionDate: z.string().optional(),
});

function EditPropertyForm() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const propertyId = params.propertyId as string;
  const firestore = useFirestore();
  const [driveUrl, setDriveUrl] = React.useState('');

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
        floorPlans: [],
        isUnderConstruction: false,
        possessionDate: '',
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
      floorPlans: property.floorPlans ?? [],
      isUnderConstruction: property.isUnderConstruction ?? false,
      possessionDate: property.possessionDate ?? '',
    };
  }, [property]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "floorPlans",
  });
  
  const isUnderConstruction = form.watch('isUnderConstruction');

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleConvertUrl = () => {
    try {
      const url = new URL(driveUrl);
      const pathParts = url.pathname.split('/');
      const fileIdIndex = pathParts.findIndex(part => part === 'd') + 1;
      if (fileIdIndex > 0 && pathParts[fileIdIndex]) {
        const fileId = pathParts[fileIdIndex];
        const convertedUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        
        const currentImagesString = form.getValues('images') as string | string[];
        const currentImages = Array.isArray(currentImagesString) 
            ? currentImagesString.join(', ') 
            : currentImagesString;

        const updatedImages = currentImages ? `${currentImages}, ${convertedUrl}` : convertedUrl;
        
        form.setValue('images', updatedImages.split(',').map(s => s.trim()) as any);
        
        toast({
          title: 'URL Converted!',
          description: 'Google Drive URL has been added to the list.',
        });
        setDriveUrl('');
      } else {
        throw new Error('Invalid Google Drive URL format.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Conversion Failed',
        description: 'Please enter a valid Google Drive file sharing link.',
      });
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !propertyId) {
        toast({ title: "Firestore not available or property ID is missing", variant: "destructive" });
        return;
    }
    const propertyToUpdateRef = doc(firestore, 'properties', propertyId);
    
    const updateData = {
      ...values,
      features: values.features || [],
      floorPlans: values.floorPlans || [],
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
          <form key={property?.id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            
             <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="isUnderConstruction"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel>
                                Is this property under construction?
                            </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <div className={cn("transition-all duration-300 ease-in-out", isUnderConstruction ? "opacity-100 max-h-40" : "opacity-0 max-h-0 overflow-hidden")}>
                    {isUnderConstruction && (
                        <FormField
                            control={form.control}
                            name="possessionDate"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Possession Date</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., December 2024" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormDescription>
                                    The estimated date of possession.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>
            </div>

            <Card className="bg-muted/30">
                <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                        <FormLabel>Google Drive URL Converter</FormLabel>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Paste Google Drive sharing link here" 
                                value={driveUrl}
                                onChange={(e) => setDriveUrl(e.target.value)}
                            />
                            <Button type="button" variant="secondary" onClick={handleConvertUrl}>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Convert & Add
                            </Button>
                        </div>
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
                            Comma-separated list of image URLs. Use the tool above for Google Drive links.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </CardContent>
            </Card>

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
            
            <div>
              <FormLabel>Floor Plans (Optional)</FormLabel>
              <div className="space-y-4 rounded-md border p-4 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-3 items-end">
                    <FormField
                      control={form.control}
                      name={`floorPlans.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Ground Floor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`floorPlans.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-xs">PDF URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "", url: "" })}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Floor Plan
                </Button>
              </div>
            </div>

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
