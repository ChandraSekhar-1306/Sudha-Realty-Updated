
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, CheckCircle, XCircle, Loader2, Copy, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc } from "firebase/firestore";
import type { ConsultationRequest } from "@/lib/types";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface EmailDialogContent {
  clientEmail: string;
  emailSubject: string;
  emailBody: string;
}

export default function AdminConsultationsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [emailDialogContent, setEmailDialogContent] = useState<EmailDialogContent | null>(null);

  const requestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "consultation_requests"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: consultationRequests, isLoading, error } = useCollection<ConsultationRequest>(requestsQuery);

  const handleUpdateStatus = (request: ConsultationRequest, newStatus: 'approved' | 'rejected') => {
    if (!firestore) {
      toast({ title: "Database not available", variant: "destructive" });
      return;
    }

    setUpdatingId(request.id);

    const requestRef = doc(firestore, 'consultation_requests', request.id);

    // Update the document in Firestore without awaiting it
    updateDoc(requestRef, { status: newStatus })
      .catch(e => {
        const permissionError = new FirestorePermissionError({
          path: requestRef.path,
          operation: 'update',
          requestResourceData: { status: newStatus },
        });
        errorEmitter.emit('permission-error', permissionError);
        console.error("Failed to update status:", e);
        toast({
          title: "Update Failed",
          description: "Could not update status in the database.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setUpdatingId(null);
      });

    // Prepare email content and open dialog
    let emailSubject = '';
    let emailBody = '';
    const schedulingLink = "https://cal.com/jayendrat/property-consultation";

    if (newStatus === 'approved') {
      emailSubject = 'Your Consultation Request has been Approved.';
      emailBody = `Dear ${request.name},\n\nWe are pleased to inform you that your request for a property consultation has been approved. Our team has verified your payment and is ready to assist you.\n\nTo schedule your session, please use the following link:\n${schedulingLink}\n\nWe look forward to speaking with you!\n\nBest regards,\nThe Sudha Realty Team`;
    } else { // Rejected
      emailSubject = 'Update on Your Consultation Request';
      emailBody = `Dear ${request.name},\n\nThank you for your interest in a consultation with Sudha Realty. After reviewing your request, we were unable to proceed at this time.\n\nThis is often due to an issue with payment verification. If you believe this is an error, please ensure your payment with Transaction ID ${request.transactionId} was completed successfully and feel free to contact us.\n\nWe appreciate your understanding.\n\nBest regards,\nThe Sudha Realty Team`;
    }

    setEmailDialogContent({
      clientEmail: request.email,
      emailSubject,
      emailBody
    });

    toast({
      title: `Request ${newStatus}`,
      description: `The request status has been updated. Please send the email.`,
    });
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${fieldName} Copied`,
      description: `${fieldName} has been copied to your clipboard.`,
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline">Manage Consultation Requests</CardTitle>
            <CardDescription>
              View and respond to personalized consultation requests from potential clients.
            </CardDescription>
          </div>
          <Button asChild variant="outline">
            <a href="https://app.cal.com/event-types" target="_blank" rel="noopener noreferrer">
              View on Cal.com
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading requests...</TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-destructive">Error loading requests.</TableCell>
                </TableRow>
              )}
              {!isLoading && !error && consultationRequests && consultationRequests.length > 0 ? (
                consultationRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.name}</TableCell>
                    <TableCell>
                      <div>{req.email}</div>
                      <div className="text-muted-foreground text-xs">{req.phone}</div>
                    </TableCell>
                    <TableCell>{req.transactionId}</TableCell>
                    <TableCell>
                      <Badge
                        variant={req.status === 'approved' ? 'default' : req.status === 'pending' ? 'secondary' : 'destructive'}
                        className="capitalize"
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{req.createdAt ? format(req.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                    <TableCell>
                      {updatingId === req.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : req.status === 'pending' ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(req, 'approved')}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(req, 'rejected')} className="text-destructive">
                              <XCircle className="mr-2 h-4 w-4" />Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-muted-foreground">Action taken</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                !isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No consultation requests found.
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!emailDialogContent} onOpenChange={(isOpen) => !isOpen && setEmailDialogContent(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Email Instructions</DialogTitle>
            <DialogDescription>
              Copy the details below and send the email from your Zoho Mail client.
            </DialogDescription>
          </DialogHeader>
          {emailDialogContent && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="zoho-link">Zoho Mail Link</Label>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="https://mail.zoho.in/zm/#compose" target="_blank" rel="noopener noreferrer">
                    Open Zoho Mail <ExternalLink className="ml-auto h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">Client's Email</Label>
                <div className="flex items-center gap-2">
                  <Input id="client-email" value={emailDialogContent.clientEmail} readOnly />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(emailDialogContent.clientEmail, "Email")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-subject">Email Subject</Label>
                <div className="flex items-center gap-2">
                  <Input id="email-subject" value={emailDialogContent.emailSubject} readOnly />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(emailDialogContent.emailSubject, "Subject")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-body">Email Body</Label>
                <div className="flex items-start gap-2">
                  <Textarea id="email-body" value={emailDialogContent.emailBody} readOnly className="h-48 resize-none" />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(emailDialogContent.emailBody, "Body")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setEmailDialogContent(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
