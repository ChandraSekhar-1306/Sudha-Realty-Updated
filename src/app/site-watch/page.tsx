
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FileCheck, ShieldCheck, Camera, LineChart, MessageSquareQuote } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  whatsappNumber: z.string().min(10, 'Please enter a valid WhatsApp number.'),
  location: z.string().min(10, 'Please provide a location link or detailed landmarks.'),
  propertySchedule: z.any().refine((files) => files?.length === 1, "Property Schedule is required."),
  layoutCopy: z.any().optional(),
});

const serviceHighlights = [
    {
        icon: Camera,
        title: 'Current Photos',
        description: 'High-resolution images of your property to show its present condition.',
    },
    {
        icon: LineChart,
        title: 'Market Analysis',
        description: 'An up-to-date assessment of the property\'s market value.',
    },
    {
        icon: ShieldCheck,
        title: 'Status Verification',
        description: 'Verification of the physical status and any noticeable changes.',
    },
    {
        icon: MessageSquareQuote,
        title: 'Professional Advice',
        description: 'Expert insights on your property\'s potential and recommendations.',
    },
];

export default function SiteWatchPage() {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      whatsappNumber: '',
      location: '',
      propertySchedule: undefined,
      layoutCopy: undefined,
    },
  });

  const propertyScheduleRef = form.register("propertySchedule");
  const layoutCopyRef = form.register("layoutCopy");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setShowSuccessDialog(true);
    form.reset();
  }

  return (
    <>
      <div className="bg-background">
        <div className="container py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column: Information */}
              <div className="space-y-8 pt-4">
                  <div>
                      <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                          Remote Property Monitoring: <span className="text-primary">Site Watch</span>
                      </h1>
                      <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                          Peace of mind for absentee landowners. We act as your eyes on the ground, providing regular, detailed updates on your property so you can manage your investment from anywhere.
                      </p>
                  </div>
                  <div className="space-y-6">
                      <h2 className="text-2xl font-semibold tracking-tight">Our Report Includes</h2>
                      <div className="space-y-6">
                           {serviceHighlights.map((item, index) => (
                               <div key={index} className="flex items-start gap-4">
                                   <div className="flex-shrink-0 flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
                                       <item.icon className="size-5" />
                                   </div>
                                   <div>
                                       <h3 className="text-base font-semibold mb-1">{item.title}</h3>
                                       <p className="text-muted-foreground text-sm">{item.description}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                  </div>
              </div>

              {/* Right Column: Form */}
              <div id="request-form" className="lg:sticky top-24">
                  <Card>
                      <CardHeader>
                          <CardTitle className="font-headline text-xl">
                              Request a Site Watch Report
                          </CardTitle>
                          <CardDescription className="text-sm">
                              Fill in your details, and we'll contact you with a price quote.
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm">
                          <Form {...form}>
                          <form
                              onSubmit={form.handleSubmit(onSubmit)}
                              className="space-y-4"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <FormField
                            control={form.control}
                            name="whatsappNumber"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>WhatsApp Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+91 12345 67890" {...field} />
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
                                  <FormLabel>Property Location</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Google Maps pin, or landmarks..."
                                      className="min-h-[80px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                control={form.control}
                                name="propertySchedule"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Property Schedule (Req.)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="file"
                                                accept="image/*,.pdf"
                                                {...propertyScheduleRef}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="layoutCopy"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Layout Copy (Opt.)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="file"
                                            accept="image/*,.pdf"
                                            {...layoutCopyRef}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                              <Button type="submit" className="w-full" size="lg">
                                  Submit for Quote
                              </Button>
                          </form>
                          </Form>
                      </CardContent>
                  </Card>
              </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Received!</AlertDialogTitle>
            <AlertDialogDescription>
              Thank you for your submission. Our team has received your details and will get back to you with a personalized price quote for your Site Watch report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    