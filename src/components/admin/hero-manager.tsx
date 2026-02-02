'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit2, Trash2, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';

interface HeroImageItem {
  id: number;
  imageUrl: string;
  description: string;
  order: number;
}

interface HeroManagerProps {
  heroImages: HeroImageItem[] | null;
  isLoading: boolean;
  error: Error | null;
  onAddNew: () => void;
  onEdit: (heroImage: HeroImageItem) => void;
  onRefresh: () => void;
}

export function HeroManager({ heroImages, isLoading, error, onAddNew, onEdit, onRefresh }: HeroManagerProps) {
  const { toast } = useToast();

  const handleDelete = async (heroImageId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/hero/${heroImageId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({ title: 'Deleted!', description: 'Hero image removed successfully.' });
        onRefresh(); // Data dobara fetch karne ke liye
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Connection failed. Check if backend is running.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin mb-2" />
      <p>Fetching Hero Slides...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center border-2 border-destructive/20 rounded-lg bg-destructive/5 text-destructive">
      Error: {error.message}
    </div>
  );

  return (
    <Card className="border-none shadow-sm bg-background/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xl">Hero Banner Manager</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Manage homepage slider images from rs_db.</p>
        </div>
        <Button onClick={onAddNew} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Slide
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[200px]">Preview</TableHead>
                <TableHead className="w-[100px]">Order</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {heroImages?.map((image) => (
                <TableRow key={image.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="relative h-20 w-32 rounded-md overflow-hidden bg-muted border">
                      <img 
                        src={image.imageUrl} // Backend provides full URL
                        alt={image.description} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Not+Found';
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-primary">#{image.order}</span>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                    {image.description || "No description"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(image)}>
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Confirm?</AlertDialogTitle>
                            <AlertDialogDescription>This will delete image from MySQL and folder.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(image.id)} className="bg-destructive">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}