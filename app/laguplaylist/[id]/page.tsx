'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PlaylistDetail = ({ params }: { params: { id: string } }) => {
  const [playlist, setPlaylist] = useState<any>(null); // Ubah tipe ke `any` atau tipe yang sesuai dengan data playlist
  const [laguList, setLaguList] = useState<any[]>([]);
  const [selectedLaguId, setSelectedLaguId] = useState<string>('');
  const [playlistSongs, setPlaylistSongs] = useState<any[]>([]);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    // Ambil data playlist
    fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('Data Playlist yang Diperoleh:', data);
        setPlaylist(data);
        setPlaylistSongs(data.lagu); // Asumsikan data.lagu berisi lagu dalam playlist
      })
      .catch(error => console.error('Error saat mengambil data playlist:', error));
  }, [id]);

  useEffect(() => {
    // Ambil data semua lagu
    fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagu`)
      .then(response => response.json())
      .then(data => {
        console.log('Data Lagu yang Diperoleh:', data);
        setLaguList(data);
      })
      .catch(error => console.error('Error saat mengambil data lagu:', error));
  }, []);

  const handleAddSong = async () => {
    if (!selectedLaguId) return;

    // Cek apakah lagu sudah ada di playlist
    const isSongAlreadyInPlaylist = playlistSongs.some(song => song.id === parseInt(selectedLaguId));
    if (isSongAlreadyInPlaylist) {
      alert('Lagu sudah ada di dalam playlist ini.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist/${id}/lagu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lagu_id: selectedLaguId }),
      });

      if (response.ok) {
        const newSong = laguList.find((lagu) => lagu.id === parseInt(selectedLaguId));
        if (newSong) {
          setPlaylistSongs((prevSongs) => [...prevSongs, newSong]);
          setSelectedLaguId('');
        }
      } else {
        const errorText = await response.text();
        console.error('Gagal menambahkan lagu:', errorText);
        alert('Gagal menambahkan lagu: ' + errorText);
      }
    } catch (error) {
      console.error('Gagal menambahkan lagu:', error);
    }
  };

  const handleDeleteSong = async (songId: number) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus lagu ini dari playlist?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/playlist/${id}/lagu/${songId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPlaylistSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
      } else {
        const errorText = await response.text();
        console.error('Gagal menghapus lagu:', errorText);
        alert('Gagal menghapus lagu: ' + errorText);
      }
    } catch (error) {
      console.error('Gagal menghapus lagu:', error);
    }
  };

  if (!playlist || laguList.length === 0) {
    return <div className="text-center p-4">Memuat...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Link href="/playlist">
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mb-6">
          Kembali ke Playlist
        </button>
      </Link>

      <h1 className="text-3xl font-bold mb-6">{playlist.title}</h1> {/* Tampilkan judul playlist */}
      <div className="border border-gray-600 bg-gray-900 text-white rounded-lg p-4 w-full mb-6">
        <h2 className="text-xl font-bold mb-4">Lagu dalam Playlist</h2>
        {playlistSongs.length > 0 ? (
          <ul className="space-y-4">
            {playlistSongs.map((song: any) => (
              <li key={song.id} className="flex items-center space-x-4">
                <span className="flex-1">{song.title}</span>
                <audio
                  controls
                  className="flex-shrink-0"
                  src={`${process.env.NEXT_PUBLIC_API_BACKEND}/storage/lagu/${song.mp3}`}
                >
                  Browser Anda tidak mendukung elemen audio.
                </audio>
                <button
                  onClick={() => handleDeleteSong(song.id)}
                  className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-600 transition duration-300"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">Belum ada lagu yang ditambahkan ke playlist ini.</p>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">Tambahkan Lagu Baru</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddSong();
        }}
      >
        <div className="mb-4">
          <label htmlFor="lagu" className="block text-lg font-medium mb-2">Pilih Lagu:</label>
          <select
            className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-2"
            id="lagu"
            value={selectedLaguId}
            onChange={(e) => setSelectedLaguId(e.target.value)}
            required
          >
            <option value="">Pilih lagu</option>
            {laguList.map((lagu) => (
              <option key={lagu.id} value={lagu.id}>
                {lagu.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Tambah Lagu
        </button>
      </form>
    </div>
  );
};

export default PlaylistDetail;
