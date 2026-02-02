'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GalleryManager } from '@/components/admin/gallery-manager';
import { GalleryForm } from '@/components/admin/gallery-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://localhost:5000';

export default function GalleryAdminPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const { toast } = useToast();

  // 1. Fetch Gallery from MySQL
  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery`);
      if (res.ok) {
        const data = await res.json();
        setGallery(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // 2. Handlers
  const handleAddNew = () => {
    setSelectedImage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedImage(item);
    setIsModalOpen(true);
  };

  // 3. Save Logic (FormData handle karne ke liye)
  const handleSave = async (formData: FormData) => {
    try {
      const isEditing = !!selectedImage;
      const url = isEditing 
        ? `${API_BASE_URL}/api/gallery/${selectedImage.id}` 
        : `${API_BASE_URL}/api/gallery`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST', // Note: Check if your backend PUT supports FormData
        body: formData,
      });

      if (response.ok) {
        toast({
          title: isEditing ? "Updated" : "Uploaded",
          description: "Gallery successfully updated in database.",
        });
        setIsModalOpen(false);
        fetchGallery(); // Refresh list
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save the image.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gallery Management</h1>
        <p className="text-muted-foreground">Upload and organize photos for the website gallery.</p>
      </div>

      <GalleryManager 
        gallery={gallery} 
        isLoading={isLoading} 
        onAddNew={handleAddNew} 
        onEdit={handleEdit} 
        onRefresh={fetchGallery} 
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedImage ? 'Edit Photo Details' : 'Upload New Photo'}
            </DialogTitle>
          </DialogHeader>
          
          <GalleryForm 
            galleryImage={selectedImage} 
            onSave={handleSave} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}