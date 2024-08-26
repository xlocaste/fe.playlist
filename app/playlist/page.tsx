'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

async function fetchPlaylists() {
  try {
    const token = Cookies.get('api_token'); // Ambil token dari cookie
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Tambahkan header Authorization
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched Data:', data);

    return Array.isArray(data.data) 
      ? data.data 
      : (data.data && Array.isArray(data.data.data)) 
        ? data.data.data 
        : [];
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch playlists');
  }
}

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaylists()
      .then(data => {
        console.log(data);
        setPlaylists(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex gap-4">
        <Link href="/">
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
            Kembali ke Halaman Utama
          </button>
        </Link>
        <Link href="/add-playlist">
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
            Tambah Playlist
          </button>
        </Link>
      </div>
      <div className="border border-gray-600 bg-gray-900 text-white rounded-lg p-3 w-full">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-600">
              <th className="py-2 px-4 text-left">Nama Playlist</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {playlists.length > 0 ? (
              playlists.map(playlist => (
                <tr key={playlist.id} className="border-b border-gray-600">
                  <td className="py-2 px-4">{playlist.title}</td>
                  <td className="py-2 px-4">
                    <Link href={`/edit-playlist/${playlist.id}`}>
                      <button className="bg-blue-500 text-white font-bold py-1 px-3 rounded hover:bg-blue-600 transition duration-300 mr-2">
                        Edit
                      </button>
                    </Link>
                    <Link href={`/laguplaylist/${playlist.id}`}>
                      <button className="bg-blue-500 text-white font-bold py-1 px-3 rounded hover:bg-blue-600 transition duration-300 mr-2">
                        Detail
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(playlist.id)}
                      className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-600 transition duration-300"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-4 text-center text-gray-500">Belum ada playlist.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  async function handleDelete(id: number) {
    if (confirm('Apakah Anda yakin ingin menghapus playlist ini?')) {
      try {
        const token = Cookies.get('api_token'); // Ambil token dari cookie
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`, // Tambahkan header Authorization
          },
        });

        if (response.ok) {
          setPlaylists(playlists.filter(p => p.id !== id));
        } else {
          throw new Error('Gagal menghapus playlist');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  }
}
