
import Link from 'next/link';
import { Building, Phone, Mail } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 flex items-center space-x-2">
               <Image src="/logofinal1.png" alt="Sudha Realty Logo" width={180} height={50} className="object-contain" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted partner in finding the perfect property.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
            <div>
              <h4 className="mb-3 font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/properties"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Properties
                  </Link>
                </li>
                 <li>
                  <Link
                    href="/commercial"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Commercial
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community-listings"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Community Listings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/consultation"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Book Consultation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/property-inspection"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Property Inspection (Soon)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/login"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Contact Us</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+91 9381303558</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>admin@sudharealty.in</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <div className="flex justify-center gap-4">
             <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-use" className="hover:text-primary transition-colors">Terms of Use</Link>
          </div>
          <p className="mt-2">&copy; {new Date().getFullYear()} Sudha Realty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

    
