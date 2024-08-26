'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPlaylistPage() {
  const [title, setTitle] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': Cookies.get('XSRF-TOKEN') || '', // Token CSRF jika diperlukan
        },
        credentials: 'include', // Pastikan cookie dikirim
        body: JSON.stringify({ title }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Playlist added:', data);
      router.push('/playlist'); // Redirect ke halaman daftar playlist setelah berhasil
    } catch (error) {
      console.error('Error adding playlist:', error);
    }
  };
  

  return (
    <div className="container mx-auto p-6">
      <div className="p-8 max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Add New Playlist</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group mb-5">
            <label htmlFor="title" className="block text-gray-300 text-lg font-semibold mb-2">Title</label>
            <input
              type="text"
              id="title"
              className="border border-gray-600 bg-gray-900 text-white rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter playlist title"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Add Playlist
          </button>
        </form>
      </div>
    </div>
  );
}
