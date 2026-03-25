'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, LogOut, Newspaper, Calendar, Rocket, 
  Image as ImageIcon, PlusCircle, LayoutDashboard,
  Target, Lock, User, ShieldCheck, Mail 
} from 'lucide-react';

// Managers & Forms
import { NewsManager } from '@/components/news/news-manager';
import { NewsForm } from '@/components/news/news-form';
import { EventsManager } from '@/components/admin/events-manager';
import { EventForm } from '@/components/admin/event-form';
import { InitiativesManager } from '@/components/admin/initiatives-manager';
import { InitiativeForm } from '@/components/admin/initiative-form';
import { HeroManager } from '@/components/admin/hero-manager';
import { HeroForm } from '@/components/admin/hero-form';
import { GalleryManager } from '@/components/admin/gallery-manager';
import { GalleryForm } from '@/components/admin/gallery-form';
import { MessagesViewer } from '@/components/messages-viewer';

// Environment variable read karein
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = `${API_URL}/api`;

type TabType = 'hero' | 'news' | 'events' | 'initiatives' | 'gallery' | 'messages';

export default function AdminPortal() {
  const { toast } = useToast();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [dataList, setDataList] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Refresh par login required rahega as requested
  }, []);

  const loadData = useCallback(async () => {
    // Messages tab has its own internal fetch logic usually, 
    // but we can load data for other tabs here.
    if (!isAuth || activeTab === 'messages') return; 
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/${activeTab}`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setDataList(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({ 
        title: "Connection Error", 
        description: "Backend server (MySQL/Express) is not responding.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, isAuth, toast]);

  useEffect(() => {
    if (isAuth) loadData();
  }, [loadData, isAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        setIsAuth(true); 
        toast({ title: "Authorized", description: `Welcome back, ${username}!` });
      } else {
        throw new Error(data.message || "Invalid Admin Credentials");
      }
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData: FormData) => {
    const isEditing = !!editingItem;
    const url = isEditing ? `${API_BASE_URL}/${activeTab}/${editingItem.id}` : `${API_BASE_URL}/${activeTab}`;
    
    setIsLoading(true);
    try {
      const res = await fetch(url, { 
        method: isEditing ? 'PUT' : 'POST', 
        body: formData // Note: FormData automatically handles multipart/form-data for images
      });
      
      if (res.ok) {
        toast({ title: "Success", description: `${activeTab} updated successfully.` });
        setIsDialogOpen(false);
        setEditingItem(null);
        loadData();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Save operation failed");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuth(false);
    setUsername('');
    setPassword('');
    toast({ title: "Logged Out", description: "Session ended safely." });
    router.refresh();
  };

  if (!mounted) return null;

  // Login Screen
  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <Card className="w-full max-w-md shadow-2xl border-none rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-primary p-10 text-center text-white">
            <ShieldCheck className="mx-auto h-12 w-12 mb-4 text-white/90" />
            <CardTitle className="text-3xl font-black uppercase tracking-tighter italic">Admin Node</CardTitle>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em]">Identity Verification Required</p>
          </CardHeader>
          <CardContent className="p-10 bg-white">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    className="pl-12 h-14 rounded-xl bg-slate-50 border-none focus-visible:ring-primary" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Enter admin ID"
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    type="password" 
                    className="pl-12 h-14 rounded-xl bg-slate-50 border-none focus-visible:ring-primary" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    required 
                  />
                </div>
              </div>
              <Button className="w-full h-14 rounded-xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02]" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Authorize Access"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-100 p-6 sticky top-0 h-screen flex flex-col bg-white">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2.5 bg-primary rounded-xl text-white shadow-lg">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="font-black text-xl uppercase tracking-tighter text-slate-900">NGO Panel</h1>
            <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest italic flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              MySQL Live
            </p>
          </div>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          <SidebarBtn id="hero" label="Hero Slides" icon={Rocket} active={activeTab} onClick={setActiveTab} />
          <SidebarBtn id="news" label="News Manager" icon={Newspaper} active={activeTab} onClick={setActiveTab} />
          <SidebarBtn id="events" label="Events" icon={Calendar} active={activeTab} onClick={setActiveTab} />
          <SidebarBtn id="initiatives" label="Initiatives" icon={Target} active={activeTab} onClick={setActiveTab} />
          <SidebarBtn id="gallery" label="Gallery" icon={ImageIcon} active={activeTab} onClick={setActiveTab} />
          <div className="pt-4 mt-4 border-t border-slate-100">
             <SidebarBtn id="messages" label="Messages" icon={Mail} active={activeTab} onClick={setActiveTab} />
          </div>
        </nav>

        <Button 
            variant="ghost" 
            className="mt-auto w-full text-red-500 hover:bg-red-50 font-bold uppercase tracking-widest text-[10px] rounded-xl py-6" 
            onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" /> Terminate Session
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-[#FBFDFF] overflow-y-auto">
        <header className="flex justify-between items-end mb-10">
          <div className="space-y-1">
            <p className="text-primary font-bold text-xs uppercase tracking-[0.2em]">Management Console</p>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">
              Manage <span className="text-primary not-italic">{activeTab}</span>
            </h2>
          </div>
          
          {activeTab !== 'messages' && (
            <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }} className="rounded-xl h-12 px-6 font-bold uppercase shadow-md transition-all hover:shadow-primary/20">
              <PlusCircle className="mr-2 h-5 w-5" /> New Entry
            </Button>
          )}
        </header>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm min-h-[60vh] overflow-hidden">
          {isLoading && activeTab !== 'messages' ? (
            <div className="h-[500px] flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary/40 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing with MySQL...</p>
            </div>
          ) : (
            <div className="p-8">
              {activeTab === 'hero' && <HeroManager heroImages={dataList} onEdit={(item) => { setEditingItem(item); setIsDialogOpen(true); }} onRefresh={loadData} isLoading={isLoading} />}
              {activeTab === 'news' && <NewsManager news={dataList} onEdit={(item) => { setEditingItem(item); setIsDialogOpen(true); }} onRefresh={loadData} isLoading={isLoading} />}
              {activeTab === 'events' && <EventsManager events={dataList} onEdit={(item) => { setEditingItem(item); setIsDialogOpen(true); }} onRefresh={loadData} isLoading={isLoading} />}
              {activeTab === 'initiatives' && <InitiativesManager initiatives={dataList} onEdit={(item) => { setEditingItem(item); setIsDialogOpen(true); }} onRefresh={loadData} isLoading={isLoading} />}
              {activeTab === 'gallery' && <GalleryManager gallery={dataList} onEdit={(item) => { setEditingItem(item); setIsDialogOpen(true); }} onRefresh={loadData} isLoading={isLoading} />}
              {activeTab === 'messages' && <MessagesViewer />}
            </div>
          )}
        </div>
      </main>

      {/* Forms Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl rounded-[2.5rem] p-0 border-none overflow-hidden shadow-2xl">
          <div className="bg-slate-900 p-8 text-white">
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
              {editingItem ? 'Update' : 'Generate'} <span className="text-primary">{activeTab}</span>
            </DialogTitle>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Fill all mandatory fields</p>
          </div>
          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {activeTab === 'news' && <NewsForm article={editingItem} onSave={handleSave} />}
            {activeTab === 'events' && <EventForm event={editingItem} onSave={handleSave} />}
            {activeTab === 'initiatives' && <InitiativeForm initiative={editingItem} onSave={handleSave} />}
            {activeTab === 'hero' && <HeroForm heroImage={editingItem} onSave={handleSave} />}
            {activeTab === 'gallery' && <GalleryForm galleryImage={editingItem} onSave={handleSave} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sidebar Button Sub-component
function SidebarBtn({ id, label, icon: Icon, active, onClick }: any) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold uppercase text-[11px] transition-all duration-200 ${
        isActive 
          ? 'bg-primary text-white shadow-lg translate-x-1' 
          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className={`h-4 w-4 ${isActive ? 'scale-110' : ''}`} />
      <span>{label}</span>
    </button>
  );
}