
'use client';

import Link from 'next/link';
import { Menu, Building, X, Home, Users, Phone, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { GeneralContactFormDialog } from './GeneralContactFormDialog';

const navLinks = [
  { href: '/properties', label: 'Properties', icon: Home },
  { href: '/community-listings', label: 'Community Listings', icon: Users },
  { href: '/consultation', label: 'Consultation', icon: Phone },
  { href: '/about', label: 'About', icon: Info },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const isHomePage = pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 10;
      setHasScrolled(window.scrollY > scrollThreshold);
    };
    
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePageTop = isHomePage && !hasScrolled;

  const headerClasses = cn(
    "fixed top-0 z-50 w-full transition-all duration-300",
    "md:bg-transparent md:border-b md:border-transparent",
    (hasScrolled || !isHomePage) && "md:border-b md:border-border/40 md:bg-background/95 md:backdrop-blur md:supports-[backdrop-filter]:bg-background/60",
    "bg-background border-b"
  );
  
  const logoBgClass = isHomePageTop ? 'md:bg-white md:p-2 md:rounded-lg' : '';
  const triggerColorClass = isHomePageTop ? 'md:text-white md:hover:bg-white/10 text-foreground hover:bg-accent' : 'text-foreground hover:bg-accent';
  
  return (
    <>
      <header className={headerClasses}>
        <div className="container">
            <div className="flex h-16 items-center justify-between">
              <Link
                href="/"
                className={cn(
                  "flex items-center space-x-2 transition-all duration-300 z-10", 
                  logoBgClass
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <Image src="/logofinal1.png" alt="Sudha Realty Logo" width={150} height={40} className="object-contain" priority />
              </Link>
              
              <nav className="hidden absolute left-1/2 -translate-x-1/2 items-center space-x-8 text-base font-medium md:flex">
                {navLinks.map((link) => (
                  <NavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </nav>

              <div className="hidden items-center justify-end md:flex">
                <GeneralContactFormDialog isHomePageTop={isHomePageTop} />
              </div>

              <div className="flex items-center justify-end md:hidden">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className={cn("transition-colors", triggerColorClass)}>
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="p-0">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <div className="p-6">
                      <div className="mb-6 flex items-center justify-between">
                        <Link
                          href="/"
                          className="flex items-center space-x-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Image src="/logofinal1.png" alt="Sudha Realty Logo" width={150} height={40} className="object-contain" />
                        </Link>
                      </div>
                      <nav className="flex flex-col space-y-2">
                        {navLinks.map((link) => (
                          <SheetClose asChild key={link.href}>
                              <NavLink href={link.href} label={link.label} isMobile />
                          </SheetClose>
                        ))}
                        <Separator className="my-2"/>
                        <SheetClose asChild>
                           <GeneralContactFormDialog />
                        </SheetClose>
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
        </div>
      </header>
    </>
  );
}

const NavLink = ({
    href,
    label,
    isMobile = false,
  }: {
    href: string;
    label: string;
    isMobile?: boolean;
  }) => {
    const pathname = usePathname();
    const [hasScrolled, setHasScrolled] = useState(false);
    const isHomePage = pathname === '/';
    
    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = 10;
            setHasScrolled(window.scrollY > scrollThreshold);
        };
        
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    const isHomePageTop = isHomePage && !hasScrolled;

    const isActive = pathname === href;
    
    const linkClasses = cn(
      'font-medium transition-colors',
      isMobile
        ? 'block w-full p-3 text-base text-left rounded-md hover:bg-accent'
        : (isActive
            ? (isHomePageTop ? 'text-white' : 'text-primary')
            : (isHomePageTop ? 'text-neutral-200 hover:text-white' : 'text-foreground/80 hover:text-foreground')),
      isMobile && isActive && 'bg-accent text-primary'
    );
    
    return (
        <Link href={href} className={linkClasses} onClick={() => isMobile && (document.querySelector('[data-radix-collection-item] button[aria-label="Close"]') as HTMLElement)?.click()}>
          {label}
        </Link>
    );
};
  
const MobileNavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
      <Link href={href} className="flex flex-col items-center gap-1 text-xs font-medium">
        <Icon className={cn("w-5 h-5", isActive ? 'text-primary' : 'text-muted-foreground')} />
        <span className={cn(isActive ? 'text-primary' : 'text-muted-foreground')}>{label}</span>
      </Link>
    );
};
