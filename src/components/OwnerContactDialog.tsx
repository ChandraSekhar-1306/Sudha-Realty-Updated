
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone, Info, User, PhoneCall, Mail } from 'lucide-react';

const formSchema = z.object({
  reason: z.enum(['Investment', 'Self Use'], { required_error: 'Please select a reason.' }),
  isDealer: z.enum(['Yes', 'No'], { required_error: 'Please specify if you are a dealer.' }),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number.'),
  agreed: z.literal<boolean>(true, {
    errorMap: () => ({ message: 'You must agree to the terms to proceed.' }),
  }),
});

type InquiryFormValues = z.infer<typeof formSchema>;

interface OwnerContactDialogProps {
  listingId: string;
  listingTitle: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

export function OwnerContactDialog({ listingId, listingTitle, ownerName, ownerEmail, ownerPhone }: OwnerContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailsRevealed, setDetailsRevealed] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      reason: undefined,
      isDealer: undefined,
      agreed: false,
    },
  });

  const onSubmit = async (data: InquiryFormValues) => {
    if (!firestore) {
        toast({ title: "Database not available", variant: "destructive" });
        return;
    }
     if (!user) {
        toast({ title: "Authentication required", description: "You must be logged in to make an inquiry.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
        const inquiryData = {
            listingId,
            listingTitle,
            userName: data.name,
            userPhone: data.phone,
            reason: data.reason,
            isDealer: data.isDealer,
            createdAt: serverTimestamp(),
        };
        const inquiriesCol = collection(firestore, 'community_inquiries');
        
        await addDoc(inquiriesCol, inquiryData).catch((e: any) => {
             const permissionError = new FirestorePermissionError({
                path: inquiriesCol.path,
                operation: 'create',
                requestResourceData: inquiryData,
            });
            errorEmitter.emit('permission-error', permissionError);
            throw e;
        });

      setDetailsRevealed(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem submitting your inquiry. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        // Reset form when dialog is closed
        form.reset();
        setDetailsRevealed(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto flex-1">
          <Phone className="mr-2 h-4 w-4" />
          Get Owner Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {!detailsRevealed ? (
          <>
            <DialogHeader>
              <DialogTitle>Please share your details to view number</DialogTitle>
              <DialogDescription>
                Provide your information to connect with the property owner.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Your reason to buy is</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Investment" /></FormControl><FormLabel className="font-normal">Investment</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Self Use" /></FormControl><FormLabel className="font-normal">Self Use</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="isDealer"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Are you a property dealer?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+91 12345 67890" {...field} /></FormControl><FormMessage /></FormItem>)}/>

                <Alert className="bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/50 dark:text-amber-200 [&>svg]:text-amber-500 dark:[&>svg]:text-amber-400">
                    <Info className="h-5 w-5" />
                    <AlertTitle className="font-bold">Disclaimer</AlertTitle>
                    <AlertDescription className="text-xs text-amber-800 dark:text-amber-300">
                       Properties in this section are independently listed by owners. Sudha Realty provides the platform but does not manage or verify these listings. All inquiries and transactions are directly between property owners and interested parties.
                    </AlertDescription>
                </Alert>
                
                <FormField
                    control={form.control}
                    name="agreed"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel className="text-xs">I have read and agree to the disclaimer.</FormLabel>
                             <FormMessage />
                        </div>
                        </FormItem>
                    )}
                />

                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Get Details
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
                <DialogTitle>Owner Contact Details</DialogTitle>
                <DialogDescription>You can now contact the property owner directly.</DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Owner Name</p>
                        <p className="font-semibold text-lg text-foreground">{ownerName}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                        <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="font-semibold text-lg text-foreground">{ownerPhone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="font-semibold text-lg text-foreground">{ownerEmail}</p>
                    </div>
                </div>
            </div>
             <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
