import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProtectedPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login'); // Arahkan ke halaman login jika token tidak ada
    }
  }, [router]);

  return (
    <div>
      {/* Konten halaman yang memerlukan otentikasi */}
      <h1>Protected Page</h1>
    </div>
  );
};

export default ProtectedPage;
