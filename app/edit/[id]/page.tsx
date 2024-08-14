'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditLaguPage() {
  const router = useRouter(); // Gunakan useRouter dari 'next/navigation'
  const { id } = useParams(); // Mengambil id dari URL dengan useParams dari 'next/navigation'
  const [title, setTitle] = useState('');
  const [mp3, setMp3] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLagu() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu/${id}`);
        const data = await response.json();
        setTitle(data.data.title);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchLagu();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    if (mp3) {
      formData.append('mp3', mp3);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        router.push('/'); // Mengarahkan pengguna kembali ke halaman utama setelah update berhasil
      } else {
        throw new Error('Gagal mengupdate lagu');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Lagu</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-black p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mp3">
            MP3 (Biarkan kosong jika tidak ingin mengganti)
          </label>
          <input
            type="file"
            id="mp3"
            onChange={(e) => setMp3(e.target.files[0])}
            className="w-full p-2 border rounded-lg"
            accept="audio/mp3"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
