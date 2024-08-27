'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function AddPlaylistPage() {
  const [title, setTitle] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ambil token dari cookies
    const token = Cookies.get('api_token');

    if (!token) {
      console.error('Token tidak ditemukan!');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist`,
        { title },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Sertakan token di header
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log('Playlist berhasil ditambahkan:', response.data);
        router.push('/playlist'); // Redirect ke halaman daftar playlist setelah berhasil
      } else {
        console.error('Gagal menambahkan playlist');
      }
    } catch (error) {
      console.error('Error menambahkan playlist:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="p-8 max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Tambah Playlist Baru</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group mb-5">
            <label htmlFor="title" className="block text-gray-300 text-lg font-semibold mb-2">Judul</label>
            <input
              type="text"
              id="title"
              className="border border-gray-600 bg-gray-900 text-white rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul playlist"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Tambah Playlist
          </button>
          <div className="mt-4">
            <Link href="/" passHref>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
                Home
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
