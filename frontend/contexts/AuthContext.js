// contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(); // ✅ Don't re-create elsewhere

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/me', {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Not authenticated');

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

