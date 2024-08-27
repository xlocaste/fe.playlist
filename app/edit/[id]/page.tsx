'use client';

import { useEffect, useState } from 'react';
import EditForm from './EditForm';
import { useRouter } from 'next/navigation';

async function fetchLagu(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu/${id}`);
  const data = await response.json();
  if (data && data.data) {
    return data.data;
  } else {
    return {};
  }
}

export default function LaguEdit({ params }: { params: { id: string } }) {
  const { id } = params;
  const [initialData, setInitialData] = useState<{ title: string; mp3: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchLagu(id)
        .then(data => {
          setInitialData(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      // Jika tidak ada ID, ini untuk mode create
      setLoading(false);
      setInitialData({ title: '', mp3: '' }); // Inisialisasi untuk mode create
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!initialData) return <p>No data found</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="p-8 max-w-lg mx-auto bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-white">{id ? 'Edit Lagu' : 'Add New Lagu'}</h1>
        <EditForm initialData={initialData} id={id} />
      </div>
    </div>
  );
}
