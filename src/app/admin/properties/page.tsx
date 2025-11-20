
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
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Link from "next/link";
import { useProperties } from "@/hooks/use-properties";
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
import type { Property } from "@/lib/types";

const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export default function AdminPropertiesPage() {
  const { properties, isLoading, error } = useProperties();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const openDeleteDialog = (property: Property) => {
    setPropertyToDelete(property);
    setShowDeleteDialog(true);
  };

  const handleDeleteProperty = async () => {
    if (!propertyToDelete || !firestore) return;

    const propertyRef = doc(firestore, 'properties', propertyToDelete.id);
    
    deleteDoc(propertyRef)
      .then(() => {
        toast({
          title: "Property Deleted",
          description: `"${propertyToDelete.title}" has been successfully deleted.`,
        });
      })
      .catch((e: any) => {
        const permissionError = new FirestorePermissionError({
          path: propertyRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setShowDeleteDialog(false);
        setPropertyToDelete(null);
      });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Manage Properties</CardTitle>
            <CardDescription>
              View, add, edit, or delete curated property listings.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1" asChild>
            <Link href="/admin/properties/add">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Property
              </span>
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading properties...</TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-destructive">Error loading properties.</TableCell>
                </TableRow>
              )}
              {!isLoading && !error && properties && properties.length > 0 ? (
                properties.map((prop) => (
                  <TableRow key={prop.id}>
                    <TableCell className="font-medium">{prop.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{prop.type}</Badge>
                    </TableCell>
                    <TableCell>{prop.location}</TableCell>
                    <TableCell className="text-right">
                      {currencyFormatter.format(prop.price)}
                    </TableCell>
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
                            <Link href={`/admin/properties/edit/${prop.id}`} className="flex items-center cursor-pointer">
                              <Pencil className="mr-2 h-4 w-4"/>Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={() => openDeleteDialog(prop)}
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
                      No properties found.
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
              property "{propertyToDelete?.title}" from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProperty}
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
