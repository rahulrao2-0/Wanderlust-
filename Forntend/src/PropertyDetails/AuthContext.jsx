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
      const res = await fetch("http://localhost:5000/me", {
        method: "GET",
        credentials: "include", // IMPORTANT for cookies
      });

      if (res.ok) {
        const data = await res.json();
        setUser({
          user: data.user,
          isHost: data.isHost,
          host: data.host,
        }); // { id, username, role }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth(); // 🔥 runs ONLY once
  }, []);

  const providerValues = {
    user, setUser,
    loading, setLoading,
    checkAuth,
  }

  return (
    <AuthContext.Provider value={providerValues}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => useContext(AuthContext);
