
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
import { MoreHorizontal, PlusCircle, Pencil, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Link from "next/link";
import { useCommunityListings } from "@/hooks/use-community-listings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useFirestore, errorEmitter, FirestorePermissionError } from "@/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { CommunityListing } from "@/lib/types";

export default function AdminCommunityListingsPage() {
  const { listings, isLoading, error } = useCommunityListings();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<CommunityListing | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const openDeleteDialog = (listing: CommunityListing) => {
    setListingToDelete(listing);
    setShowDeleteDialog(true);
  };

  const handleDeleteListing = async () => {
    if (!listingToDelete || !firestore) return;

    const listingRef = doc(firestore, 'community_listings', listingToDelete.id);
    
    deleteDoc(listingRef)
      .then(() => {
        toast({
          title: "Listing Deleted",
          description: `"${listingToDelete.title}" has been successfully deleted.`,
        });
      })
      .catch((e: any) => {
        const permissionError = new FirestorePermissionError({
          path: listingRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setShowDeleteDialog(false);
        setListingToDelete(null);
      });
  };

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Manage Community Listings</CardTitle>
          <CardDescription>
            Add, edit, or delete community-provided property listings.
          </CardDescription>
        </div>
         <Button size="sm" className="gap-1" asChild>
          <Link href="/admin/community-listings/add">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Listing
            </span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Owner Email</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Loading listings...</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-destructive">Error loading listings.</TableCell>
              </TableRow>
            )}
            {!isLoading && !error && listings && listings.length > 0 ? (
              listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">{listing.title}</TableCell>
                <TableCell>{listing.location}</TableCell>
                <TableCell>{listing.ownerEmail}</TableCell>
                <TableCell className="text-right">{listing.price}</TableCell>
                <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/community-listings/edit/${listing.id}`} className="flex items-center cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4"/>Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => openDeleteDialog(listing)}
                      >
                        <Trash2 className="mr-2 h-4 w-4"/>Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
            ) : (
              !isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No community listings found.
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
     <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              listing "{listingToDelete?.title}" from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteListing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
