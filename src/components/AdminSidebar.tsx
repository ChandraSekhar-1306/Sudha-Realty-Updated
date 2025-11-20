
'use client';

import Link from "next/link";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import { AdminNav } from "./AdminNav";
import { ArrowLeft } from "lucide-react";

export function AdminSidebar() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    if (auth) {
      try {
        await signOut(auth);
        toast({ title: "Signed out successfully." });
        router.push("/admin/login");
      } catch (error) {
        toast({
          title: "Sign out failed",
          description: "Could not sign you out. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/logofinal1.png" alt="Sudha Realty Logo" width={150} height={40} className="object-contain" />
          </Link>
        </div>
        <div className="flex-1">
          <AdminNav />
        </div>
        <div className="mt-auto p-4 space-y-2">
            <Button size="sm" variant="outline" className="w-full" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Site
                </Link>
            </Button>
            <Button size="sm" className="w-full" onClick={handleSignOut}>
                Logout
            </Button>
        </div>
      </div>
    </aside>
  );
}
