
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Image from 'next/image';
import { Mail, Phone, CheckCircle, IndianRupee, Shield } from 'lucide-react';
import { useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  transactionId: z.string().min(5, "Please enter a valid transaction ID."),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters.')
    .max(500, 'Message cannot exceed 500 characters.'),
});

const includedItems = [
    {
        title: 'Expert Consultation',
        description: 'One-on-one session with our senior advisor',
    },
    {
        title: 'Property Analysis',
        description: 'Detailed evaluation of your property interests',
    },
    {
        title: 'Market Insights',
        description: 'Current trends and investment opportunities',
    },
    {
        title: 'Personalized Recommendations',
        description: 'Tailored advice based on your needs',
    },
];

export default function ConsultationPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      transactionId: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({ title: "Database connection not found.", variant: "destructive" });
      return;
    }
    
    const requestsCollection = collection(firestore, 'consultation_requests');
    const requestData = {
      ...values,
      status: 'pending' as const,
      createdAt: serverTimestamp(),
    };

    addDoc(requestsCollection, requestData).catch(e => {
      const permissionError = new FirestorePermissionError({
        path: requestsCollection.path,
        operation: 'create',
        requestResourceData: requestData
      });
      errorEmitter.emit('permission-error', permissionError);
      // We don't re-throw here because we want to show a toast and not crash the app
    });

    toast({
      title: 'Request Submitted!',
      description:
        'We have received your consultation request and will get back to you shortly.',
    });

    form.reset();
  }

  return (
    <div className="bg-background">
        <div className="container py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                {/* Left Column: Information */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                            Expert Guidance, {' '}
                            <span className="text-primary">
                                Personalized For You
                            </span>
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                            Your real estate journey is unique. Our paid consultation service is designed to provide you with dedicated, tailored advice and a clear strategy for buying, selling, or investing.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold tracking-tight">What's Included</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {includedItems.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">Meet Our Expert</h2>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src="/pic.jpg" alt="Jayendra Tangirala" />
                                <AvatarFallback>JT</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-lg">Jayendra Tangirala</p>
                                <p className="text-sm text-muted-foreground">Lead Consultant, 20+ Years Experience</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <Card className="sticky top-24 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">Book Your Paid Session</CardTitle>
                        <CardDescription>
                            Complete the payment and fill out the form to secure your spot.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="rounded-lg bg-muted/50 p-4 text-center space-y-4">
                             <div className="bg-background/50 rounded-lg p-3">
                                <h3 className="text-md font-medium text-muted-foreground">Consultation Fee</h3>
                                <p className="text-3xl font-bold flex items-center justify-center">
                                    <IndianRupee className="h-7 w-7" />2999
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">One-time fee for a 45-minute session.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Step 1: Complete Payment</h3>
                                <p className="text-sm text-muted-foreground mt-1 mb-4">Scan the QR code to pay the consultation fee via UPI.</p>
                                <div className="flex justify-center">
                                    <Image 
                                        src="/QR.png"
                                        alt="UPI QR Code"
                                        width={200}
                                        height={200}
                                        className="rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-blue-50/50 dark:bg-blue-900/10 p-4 border border-blue-200 dark:border-blue-800/30">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 text-green-600 dark:text-green-500 pt-0.5">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Secure & Verified</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        All payments are verified by our admin team. Your consultation slot is secured only after payment verification.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <Separator />
                        <div>
                             <h3 className="font-semibold">Step 2: Submit Your Details</h3>
                            <p className="text-sm text-muted-foreground mt-1">After payment, please fill out the form below.</p>
                        </div>
                        <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                            control={form.control}
                            name="transactionId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>UPI Transaction ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your payment transaction ID" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Full Name" {...field} />
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
                            <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="(+91) 123 456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Your Message</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="I'm interested in..."
                                    className="min-h-[100px]"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting || !firestore}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Request
                                <CheckCircle className="ml-2 h-5 w-5"/>
                            </Button>
                        </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            
             <Card className="mt-16 mx-auto max-w-4xl bg-muted/30 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <h2 className="font-headline text-2xl font-semibold">Need Help?</h2>
                  <p className="mt-2 max-w-xl mx-auto text-muted-foreground">
                    Have questions before booking? Feel free to reach out to us.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <div className="flex items-center gap-2 text-foreground">
                      <Mail className="h-5 w-5 text-primary" />
                      <a href="mailto:admin@sudharealty.in" className="font-medium hover:underline">admin@sudharealty.in</a>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Phone className="h-5 w-5 text-primary" />
                      <span className="font-medium">+91 9381303558</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
    </div>
  );
}

    

    

    