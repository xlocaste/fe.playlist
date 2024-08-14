// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

async function fetchLagu() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu`);
  const data = await response.json();
  console.log(data); // Tambahkan log ini untuk melihat struktur data
  if (Array.isArray(data.data)) {
    return data.data;
  } else if (data.data && data.data.data) {
    return data.data.data;
  } else {
    return [];
  }
}

export default function HomePage() {
  const [lagu, setLagu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLagu()
      .then(data => {
        console.log(data);
        setLagu(data);
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
      <Link href="/add">
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mb-6">
          Tambah Lagu
        </button>
      </Link>
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-2 px-4 text-left text-black">MP3</th>
              <th className="py-2 px-4 text-left text-black">Title</th>
              <th className="py-2 px-4 text-left text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            {lagu.map((lagu) => (
              <tr key={lagu.id} className="border-b border-gray-100">
                <td className="py-2 px-4">
                  <audio controls className="w-full">
                    <source src={`${process.env.NEXT_PUBLIC_API_BACKEND}/storage/lagu/${lagu.mp3}`} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </td>
                <td className="py-2 px-4 text-black">{lagu.title}</td>
                <td className="py-2 px-4">
                  <Link href={`/edit/${lagu.id}`}>
                    <button className="bg-yellow-500 text-white font-bold py-1 px-3 rounded hover:bg-yellow-600 transition duration-300 mr-2">
                      Edit
                    </button>
                  </Link>
                  <Link href={`/detail/${lagu.id}`}>
                    <button className="bg-green-500 text-white font-bold py-1 px-3 rounded hover:bg-green-600 transition duration-300 mr-2">
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

  async function handleDelete(id: number) {
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
  }
}
