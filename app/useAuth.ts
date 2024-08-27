import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('api_token');
    setIsLoggedIn(!!token);
  }, []);

  const logout = () => {
    Cookies.remove('api_token'); // Hapus token saat logout
    setIsLoggedIn(false);
    // Redirect atau lakukan tindakan lain setelah logout
  };

  return { isLoggedIn, logout };
}
