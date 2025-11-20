
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, ShieldCheck, Camera, LineChart, MessageSquareQuote, Wrench } from 'lucide-react';
import Link from 'next/link';

const serviceHighlights = [
    {
        icon: Camera,
        title: 'Current Photos & Videos',
        description: 'High-resolution media to show your property\'s present condition.',
    },
    {
        icon: LineChart,
        title: 'Neighborhood Analysis',
        description: 'An update on local developments and market trends.',
    },
    {
        icon: ShieldCheck,
        title: 'Encroachment Check',
        description: 'Verification of property boundaries and any noticeable changes.',
    },
    {
        icon: MessageSquareQuote,
        title: 'Professional Advice',
        description: 'Expert insights on your property\'s potential and recommendations.',
    },
];

export default function PropertyInspectionPage() {

  return (
    <div className="bg-background">
        <div className="container py-16 sm:py-24">
            <div className="max-w-4xl mx-auto text-center">
                <div className="flex justify-center mb-4">
                    <div className="flex items-center gap-3 w-fit-content rounded-full bg-primary/10 px-4 py-2 text-primary">
                        <Wrench className="h-5 w-5" />
                        <span className="font-semibold">Under Development</span>
                    </div>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                    This Feature is <span className="text-primary">Coming Soon</span>
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    We're hard at work building our remote Property Inspection service. Soon, you'll be able to get comprehensive status reports on your property from anywhere in the world.
                </p>

                <div className="mt-12 text-left">
                    <Card>
                        <CardHeader>
                            <CardTitle>What to Expect</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {serviceHighlights.map((item, index) => (
                               <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/40">
                                   <div className="flex-shrink-0 flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary mt-1">
                                       <item.icon className="size-5" />
                                   </div>
                                   <div>
                                       <h3 className="text-base font-semibold mb-1">{item.title}</h3>
                                       <p className="text-muted-foreground text-sm">{item.description}</p>
                                   </div>
                               </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-10">
                    <Button asChild size="lg">
                        <Link href="/">Return to Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
