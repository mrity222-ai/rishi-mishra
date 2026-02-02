'use client';

import React, { useState, useEffect } from 'react';
// Folder path ko check karein agar ye components/admin folder mein hain
import { InitiativesManager } from '@/components/admin/initiatives-manager';
import { InitiativeForm } from '@/components/admin/initiative-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminInitiativesPage() {
    const [initiatives, setInitiatives] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const { toast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // 1. Fetch from MySQL
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/initiatives');
            if (!res.ok) throw new Error("Failed to fetch data");
            const data = await res.json();
            setInitiatives(data);
        } catch (err: any) {
            setError(err);
            toast({ title: "Fetch Error", description: err.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    // 2. Global Save (POST/PUT)
    const handleSave = async (formData: FormData) => {
        try {
            const url = editingItem 
                ? `http://localhost:5000/api/initiatives/${editingItem.id}` 
                : `http://localhost:5000/api/initiatives`;
            
            const method = editingItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formData, // JSON.stringify nahi, sirf FormData
            });

            if (response.ok) {
                toast({ title: editingItem ? "Initiative Updated" : "Initiative Created" });
                setIsModalOpen(false);
                setEditingItem(null);
                fetchData();
            } else {
                const errData = await response.json();
                toast({ title: "Save Failed", description: errData.error, variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Network Error", variant: "destructive" });
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Initiative Settings</h1>
                <p className="text-sm text-muted-foreground italic">MySQL Database Connection Active</p>
            </div>

            <InitiativesManager 
                initiatives={initiatives}
                isLoading={isLoading}
                error={error}
                onAddNew={handleAddNew}
                onEdit={handleEdit}
                onRefresh={fetchData}
            />

            <Dialog open={isModalOpen} onOpenChange={(open) => {
                setIsModalOpen(open);
                if(!open) setEditingItem(null); // Modal band hone par reset
            }}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold border-b pb-2">
                            {editingItem ? '✏️ Edit Initiative' : '➕ Add New Initiative'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <InitiativeForm 
                        initiative={editingItem} 
                        onSave={handleSave} 
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}