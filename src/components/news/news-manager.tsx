'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { format, isValid, parseISO } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';
import { useTranslation } from '@/hooks/use-translation';
import { Edit2, Trash2, PlusCircle, RefreshCw, ImageIcon, FileText, Newspaper, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

interface NewsItem {
  id: number;
  titleEn: string;
  titleHi: string;
  contentEn: string;
  contentHi: string;
  image?: string;
  category?: string;
  created_at: string; 
}

interface NewsManagerProps {
  news: NewsItem[] | null;
  isLoading?: boolean;
  error?: any;
  onAddNew?: () => void;
  onEdit: (article: NewsItem) => void;
  onRefresh: () => void;
}

export function NewsManager({ 
  news = [], 
  isLoading, 
  error, 
  onAddNew, 
  onEdit, 
  onRefresh 
}: NewsManagerProps) {
  const { toast } = useToast();
  const { language } = useTranslation();
  const locale = language === 'hi' ? hi : enUS;

  const handleDelete = async (articleId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/news/${articleId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({
          title: language === 'hi' ? 'सफलतापूर्वक हटाया गया' : 'Deleted Successfully',
          description: language === 'hi' ? 'लेख डेटाबेस से हटा दिया गया है।' : 'The article has been removed from the database.',
        });
        onRefresh();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Backend connection failed.',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, 'PPP', { locale }) : '---';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[2rem]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-xs font-black uppercase italic tracking-widest text-slate-400">Loading News Articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center bg-red-50 border-2 border-dashed border-red-200 rounded-[2rem]">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-red-600 uppercase italic">Database Sync Error</h3>
        <p className="text-slate-500 font-medium mb-6">Node.js server might be offline.</p>
        <Button onClick={onRefresh} variant="outline" className="rounded-xl border-red-200 text-red-600 hover:bg-red-500 hover:text-white transition-all">
          <RefreshCw className="h-4 w-4 mr-2" /> Try Reconnecting
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between px-0 pb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Newspaper className="h-7 w-7 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-black uppercase italic tracking-tighter">News Control Panel</CardTitle>
            <CardDescription className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
              Managing {news?.length || 0} Published Articles
            </CardDescription>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onRefresh} className="rounded-2xl h-12 w-12 bg-white hover:rotate-180 transition-all duration-500 border-slate-200">
            <RefreshCw className="h-5 w-5" />
          </Button>
          <Button onClick={onAddNew} className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Post
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="px-0">
        <div className="rounded-[2.5rem] border bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[45%] font-black uppercase text-[10px] tracking-widest py-6 pl-8">Article Details</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Category</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Media Status</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Publish Date</TableHead>
                <TableHead className="text-right font-black uppercase text-[10px] tracking-widest pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news && news.length > 0 ? (
                news.map((article) => (
                  <TableRow key={article.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                    <TableCell className="py-5 pl-8">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-sm text-slate-800 uppercase italic tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                          {article.titleEn}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 line-clamp-1 opacity-80">
                          {article.titleHi}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="rounded-lg font-black text-[9px] uppercase tracking-[0.1em] bg-slate-100 text-slate-500 border-none px-3">
                        {article.category || 'General'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        {article.image ? (
                          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                            <ImageIcon className="h-3 w-3" />
                            <span className="text-[9px] font-black uppercase">Cover Image</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-300 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 italic">
                            <FileText className="h-3 w-3" />
                            <span className="text-[9px] font-black uppercase">Text Only</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        {formatDate(article.created_at)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm border-slate-200"
                          onClick={() => onEdit(article)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl hover:bg-red-500 hover:text-white transition-all text-red-500 shadow-sm border-slate-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem] border-2">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Confirm Erase</AlertDialogTitle>
                              <AlertDialogDescription className="font-medium">
                                Are you sure? This will permanently remove this article from the MySQL database and public news feed.
                                <span className="block font-black text-red-500 mt-4 p-4 bg-red-50 rounded-[1.5rem] border-2 border-dashed border-red-100 italic text-sm">
                                  "{article.titleEn}"
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-6">
                              <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px]">Keep Article</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(article.id)} 
                                className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold uppercase text-[10px] px-8"
                              >
                                Delete Forever
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
                  <TableCell colSpan={5} className="h-60 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20 grayscale">
                      <Newspaper className="h-16 w-16 mb-4" />
                      <h3 className="font-black text-2xl uppercase italic tracking-tighter">No Articles Found</h3>
                      <p className="text-xs font-bold uppercase tracking-widest mt-2">Database is currently empty</p>
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