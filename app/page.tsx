'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

async function fetchLagu() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu`);
  const data = await response.json();
  
  if (Array.isArray(data)) {
    return data;
  } else if (data.data && Array.isArray(data.data)) {
    return data.data;
  } else {
    console.warn('Data tidak sesuai dengan yang diharapkan:', data);
    return [];
  }
}

export default function HomePage() {
  const [lagu, setLagu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
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
        <Link href="/playlist" className="ml-4">
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
            Playlist
          </button>
        </Link>
        <Link href="/auth/login" className='ml-4'>
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
            Login
          </button>
        </Link>
      </div>
      <div className="border border-gray-600 bg-gray-900 text-white rounded-lg p-4 w-full">
        <h1 className="text-3xl font-bold mb-6">Daftar Lagu</h1> {/* Judul Halaman */}
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
                    className="w-96" // Atur lebar pemutar audio agar lebih lebar
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
                  <Link href={`/detail/${lagu.id}`}>
                    <button className="bg-blue-500 text-white font-bold py-1 px-3 rounded hover:bg-blue-600 transition duration-300">
                      Detail
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(lagu.id)}
                    className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-600 transition duration-300"
                  >
                    Hapus
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
