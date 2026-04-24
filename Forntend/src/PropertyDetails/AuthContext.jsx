import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    user: null,
    isHost: false,
    host: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider user updated 👉", user);
  }, [user]);

  const checkAuth = async () => {
    try {
      const res = await fetch("https://wanderlust-1-s261.onrender.com/me", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      console.log("Auth check response:", data);

      if (res.ok) {
        setUser({
          user: data.user,
          isHost: data.isHost,
          host: data.host,
        });
      } else {
        setUser({
          user: null,
          isHost: false,
          host: null,
        });
      }
    } catch (err) {
      console.error("Auth check failed", err);
      setUser({
        user: null,
        isHost: false,
        host: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const providerValues = {
    user,
    setUser,
    loading,
    setLoading,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={providerValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);