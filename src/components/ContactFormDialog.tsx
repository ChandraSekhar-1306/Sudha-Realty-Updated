'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
  propertyTitle: z.string(),
  propertyUrl: z.string().url(),
});

type ContactFormValues = z.infer<typeof formSchema>;

interface ContactFormDialogProps {
  propertyTitle: string;
  propertyId: string;
}

export function ContactFormDialog({ propertyTitle, propertyId }: ContactFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    // This ensures 'window' is accessed only on the client side.
    setOrigin(window.location.origin);
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      propertyTitle: propertyTitle,
      propertyUrl: origin ? `${origin}/properties/${propertyId}` : '',
    },
  });

  useEffect(() => {
    // Reset the propertyUrl when the origin is available or propertyId changes.
    if (origin) {
      form.reset({
        ...form.getValues(),
        propertyTitle: propertyTitle,
        propertyUrl: `${origin}/properties/${propertyId}`,
      });
    }
  }, [origin, propertyId, propertyTitle, form]);


  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // =================================================================
      // IMPORTANT: Replace this URL with your own Formspree form endpoint
      // Go to formspree.io to create a new form and get your URL.
      // =================================================================
      const formspreeEndpoint = 'https://formspree.io/f/movrdvpv';
      
      const response = await fetch(formspreeEndpoint,  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: 'Inquiry Sent!',
          description: "Thank you for your interest. We'll be in touch shortly.",
        });
        form.reset();
        setOpen(false);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request. Please check your Formspree URL and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default" className="mt-2">
          <Phone className="mr-2 h-4 w-4" />
          Inquire
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inquire About Property</DialogTitle>
          <DialogDescription>
            Interested in "{propertyTitle}"? Fill out the form below and our agent will get in touch with you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="propertyTitle"
              render={({ field }) => <Input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="propertyUrl"
              render={({ field }) => <Input type="hidden" {...field} />}
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
                  <FormLabel>Email</FormLabel>
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
                    <Input placeholder="+91 12345 67890" {...field} />
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
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="I'd like to schedule a viewing..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting || !origin}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Inquiry
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
