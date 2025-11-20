
'use client';

import {
  LayoutDashboard,
  Home,
  Users,
  ClipboardCheck,
  Phone,
  MessageSquareHeart,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

const adminNavLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Home },
  { href: "/admin/community-listings", label: "Community", icon: Users },
  { href: "/admin/consultations", label: "Consultations", icon: Phone },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquareHeart },
];

export function AdminNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={cn(
      "grid items-start text-sm font-medium",
      isMobile ? "px-2 gap-2" : "px-2 lg:px-4 gap-1"
    )}>
      {isMobile && (
         <Link href="/" className="flex items-center gap-2 font-semibold mb-4 px-2">
            <Home className="h-6 w-6" />
            <span>Sudha Realty</span>
        </Link>
      )}
      {adminNavLinks.map((link) => {
        const isActive = pathname.startsWith(link.href) && (link.href !== '/admin' || pathname === '/admin');
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-muted text-primary"
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
       {isMobile && (
        <>
          <Separator className="my-2" />
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Link>
        </>
      )}
    </nav>
  );
}
