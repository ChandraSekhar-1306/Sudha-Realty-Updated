
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { CommunityInquiry } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminInquiriesPage() {
  const firestore = useFirestore();
  
  const inquiriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "community_inquiries"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: inquiries, isLoading, error } = useCollection<CommunityInquiry>(inquiriesQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Community Listing Inquiries</CardTitle>
        <CardDescription>
          Track user inquiries made on community-listed properties.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>User Phone</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Is Dealer?</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Loading inquiries...</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-destructive">Error loading inquiries.</TableCell>
              </TableRow>
            )}
            {!isLoading && !error && inquiries && inquiries.length > 0 ? (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">{inquiry.userName}</TableCell>
                  <TableCell>{inquiry.userPhone}</TableCell>
                  <TableCell>
                    <Button variant="link" asChild className="p-0 h-auto">
                        <Link href={`/community-listings/${inquiry.listingId}`} target="_blank">
                            {inquiry.listingTitle}
                        </Link>
                    </Button>
                  </TableCell>
                  <TableCell>{inquiry.reason}</TableCell>
                  <TableCell>{inquiry.isDealer}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {inquiry.createdAt ? format(inquiry.createdAt.toDate(), "PPP") : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              !isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No inquiries found.
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
