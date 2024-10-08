'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function EditPlaylistPage() {
  const [title, setTitle] = useState('');
  const router = useRouter();
  const { id } = useParams(); // Ambil ID dari URL params

  useEffect(() => {
    // Fetch data playlist yang akan diedit
    const fetchPlaylist = async () => {
      const token = Cookies.get('api_token');

      if (!token) {
        console.error('Token tidak ditemukan!');
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setTitle(response.data.data.title);
        } else {
          console.error('Failed to fetch playlist');
        }
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('api_token');

    if (!token) {
      console.error('Token tidak ditemukan!');
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist/${id}`,
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
        console.log('Playlist updated:', response.data);
        router.push('/playlist'); // Redirect ke halaman daftar playlist setelah berhasil
      } else {
        console.error('Failed to update playlist');
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="p-8 max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Edit Playlist</h1>
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
            Update Playlist
          </button>
        </form>
      </div>
    </div>
  );
}
