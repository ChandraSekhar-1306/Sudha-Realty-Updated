
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, Users, Phone, ClipboardCheck, MessageSquareHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Badge } from "@/components/ui/badge";

import Link from "next/link";
import { useCommunityListings } from "@/hooks/use-community-listings";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { ConsultationRequest, CommunityInquiry } from "@/lib/types";
import { collection, query, where, orderBy } from "firebase/firestore";
import { useProperties } from "@/hooks/use-properties";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
    const { properties } = useProperties();
    const { listings: communityListings } = useCommunityListings();
    
    const firestore = useFirestore();
    const requestsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "consultation_requests"));
    }, [firestore]);
    const { data: consultationRequests } = useCollection<ConsultationRequest>(requestsQuery);

    const inquiriesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "community_inquiries"), orderBy("createdAt", "desc"));
    }, [firestore]);
    const { data: communityInquiries } = useCollection<CommunityInquiry>(inquiriesQuery);

    const pendingConsultations = consultationRequests?.filter(r => r.status === 'pending').length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin <span className="text-primary">Dashboard</span></h1>
        <p className="text-muted-foreground">An overview of your real estate operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Managed Properties"
          value={properties?.length ?? 0}
          icon={Home}
          description="Total active listings"
        />
        <StatCard
          title="Community Listings"
          value={communityListings?.length ?? 0}
          icon={Users}
          description="Total community listings"
        />
        <StatCard
          title="Consultation Requests"
          value={consultationRequests?.length ?? 0}
          icon={Phone}
          description={`${pendingConsultations} pending`}
        />
         <StatCard
          title="Community Inquiries"
          value={communityInquiries?.length ?? 0}
          icon={MessageSquareHeart}
          description="Total inquiries on listings"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Consultation Requests</CardTitle>
                    <CardDescription>Newest client inquiries waiting for a response.</CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                    <Link href="/admin/consultations">View All</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {consultationRequests && consultationRequests.filter(r => r.status === 'pending').slice(0, 5).map(req => (
                        <TableRow key={req.id}>
                            <TableCell>
                                <div className="font-medium">{req.name}</div>
                                <div className="text-xs text-muted-foreground">{req.email}</div>
                            </TableCell>
                            <TableCell>
                                <Badge 
                                    variant={req.status === 'approved' ? 'default' : req.status === 'pending' ? 'secondary' : 'destructive'}
                                    className="capitalize"
                                >
                                    {req.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground text-xs">
                                {req.createdAt ? req.createdAt.toDate().toLocaleDateString() : ''}
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Community Inquiries</CardTitle>
                    <CardDescription>Latest user inquiries on community properties.</CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                    <Link href="/admin/inquiries">View All</Link>
                </Button>
            </CardHeader>
            <CardContent>
            <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Property</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {communityInquiries && communityInquiries.slice(0, 5).map(inquiry => (
                        <TableRow key={inquiry.id}>
                            <TableCell>
                                <div className="font-medium">{inquiry.userName}</div>
                                <div className="text-xs text-muted-foreground">{inquiry.userPhone}</div>
                            </TableCell>
                             <TableCell>
                                <Button variant="link" asChild className="p-0 h-auto text-xs text-left font-normal">
                                    <Link href={`/community-listings/${inquiry.listingId}`} target="_blank">
                                        {inquiry.listingTitle}
                                    </Link>
                                </Button>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground text-xs">
                                {inquiry.createdAt ? inquiry.createdAt.toDate().toLocaleDateString() : ''}
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
