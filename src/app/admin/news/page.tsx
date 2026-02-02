'use client';

import { useState, useEffect } from 'react';
import { NewsManager } from '@/components/news/news-manager';
import { NewsForm } from '@/components/news/news-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminNewsPage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    // State for Modal and Editing
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const { toast } = useToast();

    // 1. Database se News Fetch karna
    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/news');
            if (!res.ok) throw new Error('Database connection failed');
            const data = await res.json();
            setNews(data);
            setError(null);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNews(); }, []);

    // 2. Save Logic (Create aur Update dono ke liye)
    const handleSave = async (formData: FormData) => {
        setIsSaving(true);
        try {
            const url = editingArticle 
                ? `http://localhost:5000/api/news/${editingArticle.id}` 
                : `http://localhost:5000/api/news`;
            
            const method = editingArticle ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formData, // FormData directly bhej rahe hain
            });

            if (!response.ok) throw new Error('Failed to save');

            toast({
                title: "Success",
                description: editingArticle ? "News updated successfully" : "News published successfully",
            });

            setIsFormOpen(false);
            fetchNews(); // List refresh karein
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not save news article.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            {/* News Table Manager */}
            <NewsManager 
                news={news} 
                isLoading={loading} 
                error={error}
                onRefresh={fetchNews}
                onEdit={(article) => {
                    setEditingArticle(article);
                    setIsFormOpen(true);
                }}
                onAddNew={() => {
                    setEditingArticle(null);
                    setIsFormOpen(true);
                }}
            />

            {/* Create/Edit Popup Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b pb-4 mb-4">
                        <DialogTitle className="text-2xl font-black uppercase italic italic text-primary">
                            {editingArticle ? '🛠 Edit News Article' : '📢 Publish New Post'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <NewsForm 
                        article={editingArticle} 
                        onSave={handleSave} 
                        isSaving={isSaving} 
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}