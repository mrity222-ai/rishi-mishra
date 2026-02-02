const API_URL = 'http://localhost:5000/api';

export const galleryService = {
  // Saari images fetch karne ke liye
  getAll: async () => {
    const res = await fetch(`${API_URL}/gallery`);
    return res.json();
  },

  // Nayi image upload karne ke liye
  upload: async (data: { imageUrl: string; captionEn: string; captionHi: string }) => {
    const res = await fetch(`${API_URL}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Image delete karne ke liye
  delete: async (id: number) => {
    await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
  }
};