
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@sudharealty.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async () => {
    if (!auth) {
        setError('Firebase Auth is not available.');
        return;
    }

    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Success!',
        description: 'Redirecting to the admin dashboard.',
      });
      router.push('/admin');
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to sign in.');
      toast({
        title: 'Authentication Failed',
        description: e.message || 'Could not sign in. Please check your credentials or try again later.',
        variant: 'destructive',
      });
    }
  };
  
  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logofinal1.png" alt="Sudha Realty Logo" width={180} height={50} className="object-contain" />
            </Link>
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@example.com"
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
            />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" onClick={handleSignIn} disabled={!auth}>
            Sign In <LogIn className="ml-2 h-4 w-4" />
          </Button>
           <p className="mt-4 text-xs text-center text-muted-foreground">
             Create an account in Firebase with these credentials to log in.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    