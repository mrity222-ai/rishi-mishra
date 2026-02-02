'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit3, Trash2, PlusCircle, LayoutList, Loader2, ImageIcon } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

interface InitiativeItem {
  id: number;
  slug: string;
  titleHi: string;
  titleEn: string;
  image: string;
  display_order: number;
}

interface InitiativesManagerProps {
  initiatives: InitiativeItem[] | null;
  // Made optional for page.tsx compatibility
  isLoading?: boolean;
  error?: any;
  onAddNew?: () => void;
  onEdit: (initiative: InitiativeItem) => void;
  onRefresh: () => void;
}

export function InitiativesManager({ 
  initiatives = [], 
  isLoading, 
  error, 
  onAddNew, 
  onEdit, 
  onRefresh 
}: InitiativesManagerProps) {
  const { toast } = useToast();
  
  const handleDelete = async (initiativeId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/initiatives/${initiativeId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({
          title: 'Deleted Successfully',
          description: 'The initiative has been removed from MySQL.',
        });
        onRefresh();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Could not connect to the server.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[2rem]">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-xs font-black uppercase italic tracking-widest text-slate-400">Syncing Initiatives...</p>
    </div>
  );

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between px-0 pb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <LayoutList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-black uppercase italic tracking-tighter">Main Initiatives</CardTitle>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Manage content for your NGO's core missions
            </p>
          </div>
        </div>
        <Button onClick={onAddNew} className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Initiative
        </Button>
      </CardHeader>
      
      <CardContent className="px-0">
        <div className="rounded-[2.5rem] border bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[80px] text-center font-black uppercase text-[10px] tracking-widest py-6 pl-8">Order</TableHead>
                <TableHead className="w-[100px] font-black uppercase text-[10px] tracking-widest">Image</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Title (Hi/En)</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Slug</TableHead>
                <TableHead className="text-right font-black uppercase text-[10px] tracking-widest pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initiatives && initiatives.length > 0 ? (
                [...initiatives].sort((a, b) => a.display_order - b.display_order).map((item) => (
                  <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-center pl-8">
                      <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-500 font-black text-xs">
                        {item.display_order}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-14 w-14 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-slate-100">
                        {item.image ? (
                          <img 
                            src={`${API_BASE_URL}/uploads/initiatives/${item.image}`} 
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            alt="thumb" 
                            onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=No+Img'}}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center opacity-20 text-slate-400">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 uppercase italic tracking-tight">{item.titleHi}</span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{item.titleEn}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-[10px] bg-primary/5 text-primary font-bold px-2 py-1 rounded-lg border border-primary/10">
                        /{item.slug}
                      </code>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm" 
                          onClick={() => onEdit(item)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl hover:bg-red-500 hover:text-white transition-all text-red-500 shadow-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-black uppercase italic tracking-tighter text-xl">Confirm Delete?</AlertDialogTitle>
                              <AlertDialogDescription className="font-medium">
                                Are you sure you want to delete <strong>{item.titleEn}</strong>? This will remove its section from the website.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px]">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(item.id)} 
                                className="bg-red-500 hover:bg-red-600 rounded-xl font-bold uppercase text-[10px]"
                              >
                                Delete Initiative
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20 grayscale">
                      <LayoutList className="h-12 w-12 mb-2" />
                      <p className="font-black uppercase italic tracking-widest text-xs">No Initiatives Found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}