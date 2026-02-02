'use client';

import { useState, useEffect } from 'react';
// Relative paths update kiye gaye hain taaki error na aaye
import { HeroManager } from '@/components/admin/hero-manager';
import { HeroForm } from '@/components/admin/hero-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminHeroPage() {
  const [heroData, setHeroData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHero, setSelectedHero] = useState<any>(null);
  const { toast } = useToast();

  // 1. Data Fetch function
  const fetchHeroSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/hero');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setHeroData(data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast({
        title: "Connection Error",
        description: "Backend server (Port 5000) se connect nahi ho pa raha.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  // 2. Save/Update Function
  const handleSave = async (formData: FormData) => {
    const isEdit = selectedHero?.id;
    const url = isEdit 
      ? `http://localhost:5000/api/hero/${selectedHero.id}` 
      : 'http://localhost:5000/api/hero';
    
    try {
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: formData, 
      });

      if (res.ok) {
        toast({
          title: isEdit ? "Updated!" : "Success!",
          description: "MySQL database update ho gaya hai.",
        });
        setIsModalOpen(false);
        fetchHeroSlides(); 
      } else {
        throw new Error("Save failed");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Upload fail ho gaya. Backend console check karein.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Hero Slider Settings</h1>
      </div>

      <HeroManager 
        heroImages={heroData} 
        isLoading={loading}
        error={null}
        onAddNew={() => { setSelectedHero(null); setIsModalOpen(true); }}
        onEdit={(hero) => { setSelectedHero(hero); setIsModalOpen(true); }}
        onRefresh={fetchHeroSlides}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedHero ? '🎨 Edit Slide Details' : '➕ Add New Hero Slide'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <HeroForm heroImage={selectedHero} onSave={handleSave} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}