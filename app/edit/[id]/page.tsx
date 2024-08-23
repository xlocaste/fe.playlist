// app/lagu/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import EditForm from './EditForm';
import { useRouter } from 'next/navigation';

async function fetchLagu(id) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu/${id}`);
  const data = await response.json();
  console.log('Fetched Data:', data); // Debugging log
  if (data && data.data) {
    return data.data;
  } else {
    return {};
  }
}

export default function LaguEdit({ params }) {
  const { id } = params;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLagu(id)
      .then(data => {
        console.log('Data received in page:', data); // Debugging log
        setInitialData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="p-8 max-w-lg mx-auto card-body">
      <h1 className="text-3xl font-bold mb-6 text-white">Edit Lagu</h1>
        <EditForm initialData={initialData} id={id} />
      </div>
    </div>
  );
}
