
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

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
import { useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ArrowLeft, Wand2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

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
  facing: z.enum(['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']).optional(),
  images: z.string().transform(val => val ? val.split(',').map(s => s.trim()) : []),
  features: z.string().transform(val => val ? val.split(',').map(s => s.trim()) : []).optional(),
  saleType: z.enum(['Fresh Sales', 'Resales']).optional(),
});

export default function AddPropertyPage() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const [driveUrl, setDriveUrl] = React.useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      locationUrl: '',
      isFeatured: false,
      images: [],
      features: [],
      price: 0,
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
    },
  });
  
  const handleConvertUrl = () => {
    try {
      const url = new URL(driveUrl);
      const pathParts = url.pathname.split('/');
      const fileIdIndex = pathParts.findIndex(part => part === 'd') + 1;
      if (fileIdIndex > 0 && pathParts[fileIdIndex]) {
        const fileId = pathParts[fileIdIndex];
        const convertedUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        
        const currentImages = form.getValues('images') || [];
        const currentImagesString = Array.isArray(currentImages) ? currentImages.join(', ') : currentImages;

        const updatedImages = currentImagesString ? `${currentImagesString}, ${convertedUrl}` : convertedUrl;
        
        form.setValue('images', updatedImages.split(',').map(s => s.trim()));
        
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
    if (!firestore) {
        toast({ title: "Firestore not available", variant: "destructive" });
        return;
    }
    const propertiesCol = collection(firestore, 'properties');

    const dataToAdd = {
        ...values,
        features: values.features || [],
    };
    
    addDoc(propertiesCol, dataToAdd)
        .then(() => {
            toast({
                title: 'Property Added!',
                description: `The property "${values.title}" has been successfully added.`,
            });
            router.push('/admin/properties');
        })
        .catch((e: any) => {
            const permissionError = new FirestorePermissionError({
                path: propertiesCol.path,
                operation: 'create',
                requestResourceData: dataToAdd,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-4'>
            <Button variant="outline" size="icon" asChild>
                <Link href="/admin/properties"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
                <CardTitle>Add New Curated Property</CardTitle>
                <CardDescription>Fill out the form to add a new property to the curated listings.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <Input placeholder="https://maps.app.goo.gl/..." {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                               value={Array.isArray(field.value) ? field.value.join(', ') : (field.value || '')}
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
                       value={Array.isArray(field.value) ? field.value.join(', ') : (field.value || '')}
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
              {form.formState.isSubmitting ? 'Adding...' : 'Add Property'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
