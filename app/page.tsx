// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

async function fetchLagus() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagus`);
  const data = await response.json();
  return data.data || [];
}

export default function HomePage() {
  const [lagus, setLagus] = useState([]);

  useEffect(() => {
    fetchLagus().then(data => setLagus(data));
  }, []);

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
              <th className="py-2 px-4 text-left">MP3</th>
              <th className="py-2 px-4 text-left">Title</th>
            </tr>
          </thead>
          <tbody>
            {lagus.map((lagu) => (
              <tr key={lagu.id} className="border-b border-gray-100">
                <td className="py-2 px-4">
                  <audio controls className="w-full">
                    <source src={`${process.env.NEXT_PUBLIC_API_BACKEND}/storage/lagus/${lagu.mp3}`} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </td>
                <td className="py-2 px-4">{lagu.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
