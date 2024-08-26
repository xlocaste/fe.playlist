import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('api_token');
    setIsLoggedIn(!!token);
  }, []);

  const logout = () => {
    Cookies.remove('api_token');
    setIsLoggedIn(false);
    router.push('/auth/login');
  };

  return { isLoggedIn, logout };
}
