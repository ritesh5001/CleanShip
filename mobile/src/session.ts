import { createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SessionUser } from "./types";

/**
 * The signed-in supervisor.
 *
 * The token is the API's own JWT, stored as-is. It is not inspected or
 * verified here: this app has no secret to verify it with, and it should not
 * have one — the API is the authority on every request, and a client that
 * decided for itself whether a token was valid would only be able to get that
 * wrong. All this layer knows is "we have a token" and what the API told us
 * about the user at sign-in.
 */

const TOKEN_KEY = "cleantrack.token.v1";
const USER_KEY = "cleantrack.user.v1";

export type Stored = { token: string; user: SessionUser } | null;

export async function loadSession(): Promise<Stored> {
  try {
    const [token, raw] = await Promise.all([
      AsyncStorage.getItem(TOKEN_KEY),
      AsyncStorage.getItem(USER_KEY),
    ]);
    if (!token || !raw) return null;
    return { token, user: JSON.parse(raw) as SessionUser };
  } catch {
    return null;
  }
}

export async function saveSession(token: string, user: SessionUser) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export type SessionContextValue = {
  token: string | null;
  user: SessionUser | null;
  /** False only while the stored session is being read at startup. */
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
