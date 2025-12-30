import { createContext, useContext, useEffect, useState } from "react";
import { getMyDetails } from "../services/Auth";

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getMyDetails(token)
      .then(res => setUser({ ...res.data, token }))
      .catch(err => {
        console.error(err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]); // ✅ runs whenever token changes

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken); // triggers useEffect and updates user
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null); // triggers useEffect, sets user to null
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
