// app/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPage() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    if (file) {
      formData.append('mp3', file);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagus`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data added:', data);
      router.push('/');
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Song</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="title" className="block text-gray-300 text-lg font-semibold mb-2">Title</label>
            <input
              type="text"
              id="title"
              className="border border-gray-600 bg-gray-900 text-white rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="mp3" className="block text-gray-300 text-lg font-semibold mb-2">MP3 File</label>
            <input
              type="file"
              id="mp3"
              className="border border-gray-600 bg-gray-900 text-white rounded-lg p-3 w-full file:border-0 file:bg-blue-500 file:text-white file:font-semibold hover:file:bg-blue-600"
              accept="audio/mp3"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Add Song
          </button>
        </form>
      </div>
    </div>
  );
}
