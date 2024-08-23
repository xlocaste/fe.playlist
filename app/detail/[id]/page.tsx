// detail/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DetailProps {
    params: {
        id: number;
    };
}

async function fetchLaguById(id: number) {
    const response = await fetch(`http://127.0.0.1:8000/api/lagu/${id}`);
    if (response.ok) {
        const result = await response.json();
        console.log('Result:', result); // Periksa struktur respons di konsol
        if (result.success) {
            return result.data; // Ambil data dari properti `data`
        } else {
            throw new Error(result.message || 'Failed to fetch data');
        }
    } else {
        throw new Error('Failed to fetch data');
    }
}


export default function DetailPage({ params }: DetailProps) {
    const [lagu, setLagu] = useState<{ title: string; mp3: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    useEffect(() => {
        fetchLaguById(params.id)
            .then(data => {
                setLagu(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [params.id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto p-6">
            <button
                onClick={() => router.push('/')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mb-6"
            >
                Kembali
            </button>
            {lagu ? (
                <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-4">{lagu.title}</h1>
                    <div className="mb-5">
                        <p className="text-lg font-semibold mb-2">MP3 File:</p>
                        <audio controls className="w-full">
                            <source src={`${process.env.NEXT_PUBLIC_API_BACKEND}/storage/lagu/${lagu.mp3}`} type="audio/mp3" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>
            ) : (
                <p className="text-gray-300">Lagu tidak ditemukan.</p>
            )}
        </div>
    );
}
