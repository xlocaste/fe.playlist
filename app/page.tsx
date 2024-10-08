'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from './useAuth'; // Pastikan Anda memiliki custom hook ini

const fetchLagu = async () => {
  try {
    const token = Cookies.get('api_token');
    if (!token) {
      console.error('Token tidak ditemukan!');
      return [];
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    });

    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('Data tidak sesuai dengan yang diharapkan:', data);
      return [];
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data:', error);
    return [];
  }
};


export default function HomePage() {
  const [lagu, setLagu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { isLoggedIn, logout } = useAuth(); // Gunakan custom hook

  useEffect(() => {
    fetchLagu()
      .then(data => {
        setLagu(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  const handleAudioPlay = (audioElement: HTMLAudioElement) => {
    if (currentAudio && currentAudio !== audioElement) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setCurrentAudio(audioElement);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus lagu ini?')) {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu/${id}`);
        if (response.status === 200) {
          setLagu(lagu.filter(l => l.id !== id));
        } else {
          throw new Error('Gagal menghapus lagu');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-start mb-6">
        <Link href="/add">
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
            Tambah Lagu
          </button>
        </Link>
        {isLoggedIn ? (
          <>
            <Link href="/playlist" className="ml-4">
              <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                Playlist
              </button>
            </Link>
            <button
              onClick={logout}
              className="ml-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth/login" className="ml-4">
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
              Login
            </button>
          </Link>
        )}
      </div>
      <div className="border border-gray-600 bg-gray-900 text-white rounded-lg p-4 w-full">
        <h1 className="text-3xl font-bold mb-6">Daftar Lagu</h1>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-600">
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">MP3</th>
              <th className="py-2 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {lagu.map((lagu) => (
              <tr key={lagu.id} className="border-b border-gray-600">
                <td className="py-2 px-4">{lagu.title}</td>
                <td className="py-2 px-4">
                  <audio
                    controls
                    className="w-96"
                    onPlay={(e) => handleAudioPlay(e.currentTarget)}
                  >
                    <source src={`${process.env.NEXT_PUBLIC_API_BACKEND}/storage/lagu/${lagu.mp3}`} type="audio/mp3" />
                    Browser Anda tidak mendukung elemen audio.
                  </audio>
                </td>
                <td className="py-2 px-4 flex justify-end space-x-2">
                  <Link href={`/edit/${lagu.id}`}>
                    <button className="bg-blue-500 text-white font-bold py-1 px-3 rounded hover:bg-blue-600 transition duration-300">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(lagu.id)}
                    className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
