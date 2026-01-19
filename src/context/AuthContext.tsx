/**
 * AuthContext provides authentication utilities and state to consuming components.
 * It exposes user authentication status, user info, loading status, and methods to sign in, sign up, and sign out.
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { login, signUp as apiSignUp, getCurrentUser, type User } from "@/api/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (username: string, email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch {
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const signUp = async (username: string, email: string, password: string, firstName: string, lastName: string) => {
    const newUser = await apiSignUp({ username, email, password, firstName, lastName });
    const loginResponse = await login(username, password);
    localStorage.setItem("token", loginResponse.accessToken);
    setUser(newUser);
  };

  const signIn = async (username: string, password: string) => {
    const response = await login(username, password);
    localStorage.setItem("token", response.accessToken);
    setUser(response);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
