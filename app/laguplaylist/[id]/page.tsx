'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function LaguPlaylistPage() {
  const [laguList, setLaguList] = useState<any[]>([]);
  const [selectedLagu, setSelectedLagu] = useState<number | null>(null);
  const [playlist, setPlaylist] = useState<any>(null);
  const [playlistLagu, setPlaylistLagu] = useState<any[]>([]);
  const router = useRouter();
  const { id } = useParams(); // Ambil ID playlist dari URL params

  useEffect(() => {
    const fetchPlaylistAndLagu = async () => {
      const token = Cookies.get('api_token');

      if (!token) {
        console.error('Token tidak ditemukan!');
        return;
      }

      try {
        // Ambil detail playlist
        const playlistResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const playlistData = playlistResponse.data.data;
        setPlaylist(playlistData);
        setPlaylistLagu(playlistData.lagu); // Simpan lagu-lagu yang ada di dalam playlist

        // Ambil daftar lagu yang tersedia
        const laguResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        // Periksa data yang diterima
        console.log('Daftar lagu:', laguResponse.data);

        setLaguList(laguResponse.data || []); // Pastikan untuk menginisialisasi dengan array kosong
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPlaylistAndLagu();
  }, [id]);

  const handleAddLagu = async () => {
    const token = Cookies.get('api_token');

    if (!token) {
        console.error('Token tidak ditemukan!');
        return;
    }

    try {
        await axios.post(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist/${id}/add-song`,
            { lagu_id: selectedLagu },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        // Refresh data setelah berhasil menambahkan lagu
        const playlistResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        const playlistData = playlistResponse.data.data;
        setPlaylist(playlistData);
        setPlaylistLagu(playlistData.lagu);
    } catch (error) {
        console.error('Error adding lagu to playlist:', error);
    }
  };

  const handleRemoveLagu = async (laguId: number) => {
    const token = Cookies.get('api_token');

    if (!token) {
      console.error('Token tidak ditemukan!');
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist/${id}/remove-song/${laguId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Refresh data setelah berhasil menghapus lagu
      const playlistResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const playlistData = playlistResponse.data.data;
      setPlaylist(playlistData);
      setPlaylistLagu(playlistData.lagu);
    } catch (error) {
      console.error('Error removing lagu from playlist:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/" passHref>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
            Home
          </button>
        </Link>
      </div>
      {playlist && (
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-4">{playlist.title}</h1>
          <ul className="space-y-4">
            {playlistLagu.map((lagu: any) => (
              <li key={lagu.id} className="bg-gray-800 text-white p-4 rounded-lg shadow-lg flex justify-between items-center">
                <div className="flex flex-col">
                  <span>{lagu.title}</span>
                  <audio controls className="mt-2">
                    <source src={lagu.mp3} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <button
                  onClick={() => handleRemoveLagu(lagu.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Add Song to Playlist</h2>
        <select
          value={selectedLagu || ''}
          onChange={(e) => setSelectedLagu(Number(e.target.value))}
          className="border border-gray-600 bg-gray-900 text-white rounded-lg p-3 w-full mb-4"
        >
          <option value="">Select a song</option>
          {laguList.length > 0 ? (
            laguList.map((lagu: any) => (
              <option key={lagu.id} value={lagu.id}>
                {lagu.title}
              </option>
            ))
          ) : (
            <option value="">No songs available</option>
          )}
        </select>
        <button
          onClick={handleAddLagu}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
        >
          Add Song
        </button>
      </div>
    </div>
  );
}
