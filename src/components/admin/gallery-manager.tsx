'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit2, Trash2, Plus, Loader2, ImageOff } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

interface GalleryItem {
  id: number;
  image_url: string;  // Database naming convention
  caption: string;    
}

interface GalleryManagerProps {
  gallery: GalleryItem[] | null;
  isLoading?: boolean;
  onEdit: (item: GalleryItem) => void;
  onRefresh: () => void;
}

// 1. "export" keyword zaroori hai error fix karne ke liye
export function GalleryManager({ 
  gallery = [], 
  isLoading, 
  onEdit, 
  onRefresh 
}: GalleryManagerProps) {
  const { toast } = useToast();

  const getImageUrl = (path: string) => {
    if (!path) return 'https://placehold.co/600x400?text=Missing+Image';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}/uploads/gallery/${path}`; // Gallery folder path
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({ title: 'Success', description: 'Gallery image removed.' });
        onRefresh();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Could not connect to rs_db.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-dashed">
      <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
      <p className="font-black uppercase italic tracking-widest text-slate-400">Loading Gallery...</p>
    </div>
  );

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between px-0 pb-8">
        <div>
          <CardTitle className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
            Media <span className="text-primary">Gallery</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1 font-bold uppercase tracking-widest">
            {gallery?.length || 0} images in rs_db
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="px-0">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-b-2">
                <TableHead className="w-[200px] py-6 pl-8 font-black text-slate-400 uppercase text-[10px] tracking-widest">Preview</TableHead>
                <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Caption</TableHead>
                <TableHead className="text-right pr-8 font-black text-slate-400 uppercase text-[10px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!gallery || gallery.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-64 text-center">
                    <ImageOff size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-black uppercase italic text-slate-300">No Gallery Media</p>
                  </TableCell>
                </TableRow>
              ) : (
                gallery.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-slate-50/30">
                    <TableCell className="pl-8 py-4">
                      <div className="h-24 w-32 rounded-2xl overflow-hidden bg-slate-100 border-2">
                        <img 
                          src={getImageUrl(item.image_url)} 
                          alt={item.caption} 
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-black uppercase italic text-slate-800">
                        {item.caption || "Untitled Image"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" size="icon" onClick={() => onEdit(item)} className="h-10 w-10 rounded-xl">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-black italic uppercase">Delete Image?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently remove this item from the gallery.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-500 rounded-xl uppercase font-black italic">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}