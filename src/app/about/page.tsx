
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Scale, Heart, BarChart, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const coreValues = [
    {
        title: "Integrity First",
        description: "Every transaction is handled with the utmost honesty and transparency.",
        icon: Scale,
    },
    {
        title: "Client-Centric",
        description: "Your goals are our primary focus. We provide tailored advice to meet your unique needs.",
        icon: Heart,
    },
    {
        title: "Market Expertise",
        description: "We leverage deep market knowledge to ensure you get the best value.",
        icon: BarChart,
    },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container py-16 sm:py-24">
        {/* Founder Section */}
        <section className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="lg:order-last">
              <Image
                src="/pic.jpg"
                alt="Jayendra Tangirala, Founder & Lead Consultant"
                width={600}
                height={750}
                className="rounded-lg shadow-xl object-cover aspect-[4/5] mx-auto"
                data-ai-hint="professional man"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Meet the <span className="text-primary">Founder</span>
              </h2>
              <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary">
                      <AvatarImage src="/pic.jpg" alt="Jayendra Tangirala" />
                      <AvatarFallback>JT</AvatarFallback>
                  </Avatar>
                  <div>
                      <p className="text-xl font-bold">Jayendra Tangirala</p>
                      <p className="text-md text-muted-foreground">Lead Consultant & Founder</p>
                  </div>
              </div>
              <div className="text-lg text-muted-foreground space-y-4">
                <p>
                  With more than twenty years of trusted experience in real estate, I take great pride in helping clients and their families find the perfect homes and make wise investment choices. My commitment to honesty, heartfelt guidance, and personalized care has helped many families turn their real estate dreams into reality.
                </p>
                <p>
                  Whether you’re a first-time buyer, a seasoned investor, or planning to sell, I’m dedicated to supporting you every step of the way. With deep market knowledge and strong negotiation skills, I strive to create positive, stress-free experiences, building lasting relationships based on trust and shared success.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/consultation">Book a Session</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="mt-24">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Our Core <span className="text-primary">Values</span>
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    These principles guide every action we take and every piece of advice we give.
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {coreValues.map(value => (
                     <div key={value.title} className="flex flex-col items-center text-center p-8 rounded-lg transition-all hover:bg-card hover:shadow-lg border bg-card">
                        <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary mb-5">
                            <value.icon className="size-7" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">
                           {value.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>

        {/* CTA Section */}
        <section className="mt-24">
            <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
                        <p className="mt-2 text-primary-foreground/80 max-w-2xl">
                            Whether you're looking to buy, sell, or simply get expert advice on the market, we're here to help. Let's build your real estate future together.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <Button asChild size="lg" variant="secondary">
                            <Link href="/properties">Explore Properties</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
      </div>
    </div>
  );
}
