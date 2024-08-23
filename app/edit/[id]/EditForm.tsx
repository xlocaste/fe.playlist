// app/lagu/[id]/EditForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EditFormProps {
    initialData: {
        title: string;
        mp3: string;
    };
    id: number;
}

function EditForm({ initialData, id }: EditFormProps) {
    const [title, setTitle] = useState<string>(initialData.title || '');
    const [mp3File, setMp3File] = useState<File | null>(null);
    const router = useRouter();

    // Mengupdate state saat initialData berubah
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        if (mp3File) {
            formData.append('mp3', mp3File);
        }
        formData.append('_method', 'PUT');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu/${id}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Success:', data);
                router.push('/'); // Redirect ke halaman daftar lagu setelah berhasil
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
            <div className="form-group mb-5">
                <label className="block text-gray-300 text-lg font-semibold mb-2">Judul</label>
                <input
                    type="text"
                    className="border border-gray-600 bg-gray-900 text-white rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter song title"
                    required
                />
            </div>

            <div className="form-group mb-5">
                <label htmlFor="mp3" className="block text-gray-300 text-lg font-semibold mb-2">MP3 File (Optional)</label>
                <input
                    type="file"
                    id="mp3"
                    className="border border-gray-600 bg-gray-900 text-white rounded-lg p-3 w-full file:border-0 file:bg-blue-500 file:text-white file:font-semibold hover:file:bg-blue-600"
                    accept="audio/mp3"
                    onChange={(e) => setMp3File(e.target.files ? e.target.files[0] : null)}
                />
            </div>

            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
                Simpan Perubahan
            </button>
        </form>
    );
}

export default EditForm;
