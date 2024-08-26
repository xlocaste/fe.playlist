// app/lagu/[id]/EditForm.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface EditFormProps {
  initialData: {
    title: string;
    mp3: string;
  };
  id: string;
  isNew?: boolean; // Tambahkan properti ini untuk membedakan antara POST dan PUT
}

export default function EditForm({ initialData, id, isNew = false }: EditFormProps) {
  const [title, setTitle] = useState(initialData.title || '');
  const [mp3, setMp3] = useState(initialData.mp3 || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const endpoint = isNew 
        ? `${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu` 
        : `${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu/${id}`;

      const method = isNew ? 'POST' : 'PUT';

      const response = await axios({
        method,
        url: endpoint,
        data: { title, mp3 },
      });

      if (response.status === 200 || response.status === 201) {
        router.push('/');
      } else {
        throw new Error('Gagal menyimpan data lagu.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNew) {
      setTitle(initialData.title || '');
      setMp3(initialData.mp3 || '');
    }
  }, [initialData, isNew]);

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label htmlFor="title" className="block text-white text-sm font-bold mb-2">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input w-full p-2 border border-gray-600 rounded bg-gray-900 text-white"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="mp3" className="block text-white text-sm font-bold mb-2">MP3 File URL</label>
        <input
          id="mp3"
          type="text"
          value={mp3}
          onChange={(e) => setMp3(e.target.value)}
          className="form-input w-full p-2 border border-gray-600 rounded bg-gray-900 text-white"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Saving...' : (isNew ? 'Create' : 'Update')}
      </button>
    </form>
  );
}
