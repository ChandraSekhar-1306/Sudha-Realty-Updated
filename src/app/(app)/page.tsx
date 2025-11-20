
'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Home as HomeIcon, Users, Eye, Search, MapPin, Building, Wind, LandPlot, Star, Award, ShieldCheck, MessageSquareQuote, Mic, LocateIcon, ExternalLink, Clock, LineChart, Shield, Lightbulb, IndianRupee, Heart, BarChart, Scale } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';


const CuratedSearch = () => {
    const [propertyType, setPropertyType] = useState('Apartment');
    const [location, setLocation] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        let path = '/properties';
        if (['Commercial Space', 'Office', 'Showroom', 'Warehouse'].includes(propertyType)) {
            path = '/commercial';
        }
        
        const queryParams = new URLSearchParams();

        if (propertyType) {
            queryParams.set('type', propertyType);
        }
        if (location) {
            queryParams.set('location', location);
        }

        router.push(`${path}?${queryParams.toString()}`);
    };

    return (
        <div className="flex flex-col md:flex-row items-center gap-2 p-2 rounded-lg bg-background">
             <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-full md:w-[180px] h-9 md:h-12 text-base border-0 focus:ring-0">
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Apartment">Apartments</SelectItem>
                    <SelectItem value="Villa">Villas</SelectItem>
                    <SelectItem value="Open Plot">Open Plots</SelectItem>
                    <SelectItem value="Farmland">Farmlands</SelectItem>
                    <SelectItem value="Commercial Space">Commercial</SelectItem>
                </SelectContent>
            </Select>
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    placeholder="Search by location, e.g., 'Jubilee Hills'"
                    className="w-full bg-background text-foreground border-none pl-10 h-9 md:h-12 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
            </div>
            <Button size="lg" className="h-9 md:h-12 text-base px-8 rounded-lg w-full sm:w-auto" onClick={handleSearch}>
                Search
            </Button>
        </div>
    );
};


export default function HomePage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image-2');

  if (!heroImage) return null;

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-black">
        <div className='relative h-[60vh] sm:h-[55vh] flex items-center justify-center'>
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover object-center"
              priority
              data-ai-hint={heroImage.imageHint}
            />
            <div className="absolute inset-0 bg-black/60 z-10" />

            <div className='relative z-20 container text-white text-center md:text-right'>
                <div className='max-w-2xl md:ml-auto space-y-4'>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md">
                      Discover your <span className='text-amber-400'>Dream Space</span>
                    </h1>
                    <p className="text-lg text-neutral-200 drop-shadow-sm font-normal hidden md:block">
                        Professional expertise with personalized consultations. Book an appointment with our expert or explore properties tailored to your needs.
                    </p>
                     <p className="text-base text-neutral-200 drop-shadow-sm font-normal md:hidden">
                        Expert consultations & premium properties.
                    </p>
                </div>
            </div>
        </div>

        <div className="relative z-30 -mt-16 md:-mt-20 container">
             {/* Desktop Search Card */}
             <div className="hidden md:block">
                <Card className="max-w-5xl mx-auto shadow-2xl">
                    <CardContent className="p-2">
                        <Tabs defaultValue="curated" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 h-auto bg-muted/50 rounded-lg p-1">
                                <TabsTrigger value="curated" className="h-10 text-base">Curated</TabsTrigger>
                                <TabsTrigger value="community" className="h-10 text-base">Community</TabsTrigger>
                                <TabsTrigger value="commercial" className="h-10 text-base">Commercial</TabsTrigger>
                                <TabsTrigger value="property-inspection" className="h-10 text-base">Property Inspection</TabsTrigger>
                            </TabsList>
                            <TabsContent value="curated" className="mt-2">
                            <CuratedSearch />
                            </TabsContent>
                            <TabsContent value="community" className="mt-2 text-center p-4">
                            <div className="flex flex-col items-center justify-center gap-3 h-[76px]">
                                <p className="text-sm text-muted-foreground">Explore properties listed directly by owners.</p>
                                <Button asChild>
                                    <Link href="/community-listings">Browse Community Platform <ExternalLink className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </div>
                            </TabsContent>
                            <TabsContent value="commercial" className="mt-2 text-center p-4">
                            <div className="flex flex-col items-center justify-center gap-3 h-[76px]">
                                <p className="text-sm text-muted-foreground">Find commercial spaces for your business needs.</p>
                                <Button asChild>
                                    <Link href="/commercial">Explore Commercial <ExternalLink className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </div>
                            </TabsContent>
                            <TabsContent value="property-inspection" className="mt-2 text-center p-4">
                                <div className="flex flex-col items-center justify-center gap-3 h-[76px]">
                                    <div className='flex items-center gap-2'>
                                    <p className="text-sm text-muted-foreground">Request a status check for your property from anywhere.</p>
                                    <Badge variant="secondary">Coming Soon</Badge>
                                    </div>
                                    <Button disabled>
                                        Request an Inspection Report <Eye className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
             </div>
             
             {/* Mobile Search Card */}
             <div className="md:hidden">
                <Card className="shadow-lg">
                    <CardContent className="p-2 space-y-4">
                        <CuratedSearch />
                    </CardContent>
                </Card>
             </div>
        </div>
      </section>

      <main className="py-12 sm:py-16">
          {/* Why Choose Us Section */}
          <section id="why-choose-us" className="pt-16 sm:pt-20 bg-background">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold">
                       Your Success Is <span className="text-primary">Our Priority</span>
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        More than just transactions—we build lasting partnerships through integrity, local expertise, and genuine commitment to your property goals.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="flex flex-col items-center text-center p-6 rounded-lg transition-all hover:bg-card hover:shadow-md border bg-card">
                        <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary mb-4">
                            <ShieldCheck className="size-7" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Legal Peace of Mind</h3>
                        <p className="text-muted-foreground">
                           Every property comes with thorough documentation review and clear title verification.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-lg transition-all hover:bg-card hover:shadow-md border bg-card">
                        <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary mb-4">
                            <Users className="size-7" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Network That Works</h3>
                        <p className="text-muted-foreground">
                           Leverage our extensive connections with builders, developers, and property owners for opportunities before they hit the market.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-lg transition-all hover:bg-card hover:shadow-md border bg-card">
                        <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary mb-4">
                            <Scale className="size-7" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Hidden Surprises</h3>
                        <p className="text-muted-foreground">
                           Transparent dealings with upfront pricing, honest property assessments, and full disclosure of all costs involved.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-lg transition-all hover:bg-card hover:shadow-md border bg-card">
                        <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary mb-4">
                            <LineChart className="size-7" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">ROI-Focused Approach</h3>
                        <p className="text-muted-foreground">
                            Strategic location analysis and growth projections to ensure your property appreciates in value over time.
                        </p>
                    </div>
                </div>
                 <div className="mt-10 text-center">
                    <Button asChild size="lg">
                        <Link href="/about">Learn More About Us <ArrowRight className="ml-2" /></Link>
                    </Button>
                </div>
            </div>
          </section>

           {/* Why Paid Consultation Section */}
          <section id="why-paid" className="py-16 sm:py-24 bg-secondary/30">
            <div className="container">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Benefits of a {' '}
                        <span className="text-primary">
                            Professional Consultation
                        </span>
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Your consultation is an investment in making the right property decision—potentially saving you lakhs while securing your dream home or investment.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-center mb-6">What's Included</h2>
                        <Card className="p-6 text-left hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
                                    <Award className="size-5"/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Expert Property Analysis</h3>
                                    <p className="text-muted-foreground text-sm mt-1">Detailed evaluation of properties matching your specific requirements and budget.</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 text-left hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
                                    <LineChart className="size-5"/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Market Insights</h3>
                                    <p className="text-muted-foreground text-sm mt-1">Current trends, pricing analysis, and future growth potential in your preferred areas.</p>
                                </div>
                            </div>
                        </Card>
                         <Card className="p-6 text-left hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
                                    <Lightbulb className="size-5"/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
                                    <p className="text-muted-foreground text-sm mt-1">Tailored advice based on your unique needs, whether buying, selling, or investing.</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 text-left hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
                                    <Users className="size-5"/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">End-to-End Support</h3>
                                    <p className="text-muted-foreground text-sm mt-1">Comprehensive assistance throughout your property journey with expert guidance.</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-center mb-6">Your Advantages</h2>
                       <Card className="p-6 text-left h-full">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="size-5 text-green-500 mt-1 flex-shrink-0"/>
                                    <p className="text-muted-foreground">20+ years of proven expertise in Hyderabad real estate</p>
                                </li>
                                 <li className="flex items-start gap-3">
                                    <CheckCircle className="size-5 text-green-500 mt-1 flex-shrink-0"/>
                                    <p className="text-muted-foreground">Strong negotiation skills saving you lakhs</p>
                                </li>
                                 <li className="flex items-start gap-3">
                                    <CheckCircle className="size-5 text-green-500 mt-1 flex-shrink-0"/>
                                    <p className="text-muted-foreground">Verified properties with complete legal clarity</p>
                                </li>
                            </ul>
                            <div className="mt-6 bg-primary/10 p-4 rounded-lg border border-primary/20">
                                 <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary flex-shrink-0 mt-1">
                                        <Clock className="size-4"/>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary">Time-Saving Promise</h3>
                                        <p className="text-muted-foreground text-sm mt-1">Skip months of property hunting confusion. Get expert guidance that fast-tracks your search with pre-verified options matching your exact criteria.</p>
                                    </div>
                                </div>
                            </div>
                       </Card>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto mt-12 space-y-6">
                    <Alert className="bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/50 dark:text-amber-200 [&>svg]:text-amber-500 dark:[&gt;svg]:text-amber-400">
                        <Lightbulb className="h-5 w-5" />
                        <AlertTitle className="font-bold">Independent Consultation</AlertTitle>
                        <AlertDescription className="text-amber-800 dark:text-amber-300">
                           This consultation is designed for clarity and guidance—there's no obligation to buy property through Sudha Realty. Whether you're feeling confused about the market or exploring your options, our expert advice empowers you to make informed decisions and purchase from anywhere that suits you best.
                        </AlertDescription>
                    </Alert>

                     <Card>
                        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                           <div className="text-center sm:text-left">
                              <CardTitle className="text-2xl font-bold">Schedule Your Consultation</CardTitle>
                              <p className="text-muted-foreground mt-2 max-w-md">
                                 Join hundreds of satisfied clients who made informed property decisions with professional guidance. Take the first step towards your dream property today!
                              </p>
                           </div>
                           <div className="flex flex-col items-center gap-3 shrink-0">
                                 <p className="text-3xl font-bold flex items-center justify-center">
                                    <IndianRupee className="h-7 w-7" />2,999
                                </p>
                              <Button asChild size="lg">
                                 <Link href="/consultation">Book Your Consultation</Link>
                              </Button>
                           </div>
                        </CardContent>
                     </Card>
                </div>

            </div>
          </section>

          {/* Services Section */}
          <section className="py-16 sm:py-24 bg-background">
            <div className="container">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold">
                    Comprehensive Real Estate{' '}
                    <span className="text-primary">
                        Solutions
                    </span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                  I offer a complete suite of services to ensure your property journey is seamless, transparent, and successful.
                </p>
              </div>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col p-6 rounded-lg transition-all hover:bg-card hover:shadow-md border bg-card">
                  <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mb-4 self-start">
                    <HomeIcon className="size-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Curated Property Listings</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">
                    Explore a handpicked selection of properties that have been vetted for quality, legal clarity, and value. I do the due diligence so you don't have to.
                  </p>
                  <Button asChild variant="link" className="text-primary self-start px-0">
                    <Link href="/properties">Browse Listings <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </div>
                <div className="flex flex-col p-6 rounded-lg transition-all hover:bg-card hover:shadow-md border bg-card">
                  <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mb-4 self-start">
                    <Users className="size-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Community Platform</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">
                    Connect directly with property owners. My community platform is a space for direct, transparent transactions without middlemen.
                  </p>
                  <Button asChild variant="link" className="text-primary self-start px-0">
                    <Link href="/community-listings">Explore Community <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </div>
                <div className="flex flex-col p-6 rounded-lg transition-all hover:bg-card hover:shadow-md border bg-card">
                  <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mb-4 self-start">
                    <Eye className="size-6" />
                  </div>
                  <div className="flex items-center mb-2 gap-2">
                    <h3 className="text-xl font-semibold">Property Inspection</h3>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 flex-grow">
                    For absentee owners, I offer a remote monitoring service. Get regular updates, photos, and status checks on your property investment.
                  </p>
                  <Button variant="link" className="text-primary self-start px-0" disabled>
                    Request a Check <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
      </main>
      <Footer />
    </div>
  );
}

    

    

    
