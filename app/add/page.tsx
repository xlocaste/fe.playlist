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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu`, {
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
    <div className="container mx-auto p-6">
      <div className= "p-8 max-w-lg mx-auto card-body">
        <h1 className="text-3xl font-bold mb-6 text-white">Tambah Lagu Baru</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className='space-y-6'>
          <div className="form-group mb-5">
            <label htmlFor="title" className="block text-gray-300 text-lg font-semibold mb-2">Judul</label>
            <input
              type="text"
              id="title"
              className="border border-gray-600 bg-gray-900 text-white rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan Judul Lagu"
              required
            />
          </div>
          <div className="form-group mb-5">
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
            Tambah Lagu 
          </button>
        </form>
      </div>
    </div>
  );
}
