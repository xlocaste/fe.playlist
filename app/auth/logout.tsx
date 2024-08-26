"use client";

import { useRouter } from 'next/navigation';

const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/auth/login');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Logout</h1>
      <button
        onClick={handleLogout}
        className="w-full p-2 bg-red-500 text-white rounded mb-4"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
