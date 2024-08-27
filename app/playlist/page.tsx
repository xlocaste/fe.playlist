'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        // Ambil token dari cookies
        const token = Cookies.get('api_token'); // Pastikan nama cookie sesuai

        // Cek jika token undefined, beri notifikasi atau handle kesalahan
        if (!token) {
          setError('Token tidak ditemukan!');
          setLoading(false);
          return;
        }

        // Mengambil data playlists dari API
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true,
        });

        console.log('Response Data:', response.data);

        // Mengakses data playlist dari respons API
        setPlaylists(response.data.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setError('Terjadi kesalahan saat mengambil data playlists.');
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus playlist ini?')) {
      try {
        const token = Cookies.get('api_token');
        if (!token) {
          setError('Token tidak ditemukan!');
          return;
        }
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true,
        });
        if (response.status === 200) {
          setPlaylists(playlists.filter(p => p.id !== id));
        } else {
          throw new Error('Gagal menghapus playlist');
        }
      } catch (error) {
        setError('Terjadi kesalahan saat menghapus playlist.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
      <button
        onClick={() => router.push('/playlist/add-playlist')}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 mb-4"
      >
        Add New Playlist
      </button>
      <ul className="space-y-4">
        {Array.isArray(playlists) && playlists.map((playlist: any) => (
          <li key={playlist.id} className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{playlist.title}</h2>
              <div className="space-x-2">
                <button
                  onClick={() => router.push(`/laguplaylist/${playlist.id}`)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded transition duration-300"
                >
                  Detail
                </button>
                <button
                  onClick={() => router.push(`/edit-playlist/${playlist.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(playlist.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
