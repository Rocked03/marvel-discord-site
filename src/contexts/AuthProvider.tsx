import { signOut as apiSignOut, getUser } from "@/api/polls/auth";
import type { DiscordUserProfile } from "@jocasta-polls-api";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AuthContextType {
  user: DiscordUserProfile | null;
  fetchUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  fetchUser: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DiscordUserProfile | null>(null);

  const fetchUser = useCallback(async () => {
    await getUser()
      .then((userData) => {
        setUser(userData);
      })
      .catch((error) => {
        setUser(null);
      });
  }, []);

  const signOut = useCallback<AuthContextType["signOut"]>(async () => {
    await apiSignOut();
    setUser(null);
  }, []);

  fetchUser();

  return (
    <AuthContext.Provider value={{ user, fetchUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
