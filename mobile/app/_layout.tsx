import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, Pressable, StyleSheet, Text, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";
import * as api from "../src/api";
import {
  clearSession,
  loadSession,
  saveSession,
  SessionContext,
  type SessionContextValue,
} from "../src/session";
import { clearCache } from "../src/cache";
import { clearQueue, readQueue, subscribe } from "../src/queue";
import { flushQueue } from "../src/sync";
import { colors } from "../src/theme";
import type { SessionUser } from "../src/types";

/**
 * The shell: who is signed in, and getting queued work off the device.
 *
 * Syncing lives here rather than on a screen because it has to keep happening
 * when the supervisor is looking at something else — or at nothing, with the
 * phone in a pocket between holds. It runs when connectivity returns, when the
 * app comes back to the foreground, and on a slow timer as a backstop.
 */
export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(0);
  const [rejection, setRejection] = useState<{
    message: string;
    count: number;
  } | null>(null);

  /* The subscription below is set up once; this keeps it calling the current
     sync rather than one closed over a stale token. */
  const syncRef = useRef<(() => Promise<void>) | null>(null);

  /* Read in a ref as well as state: the sync callbacks are long-lived and
     would otherwise close over a stale token after a re-sign-in. */
  const tokenRef = useRef<string | null>(null);
  tokenRef.current = token;

  const signOut = useCallback(async () => {
    setToken(null);
    setUser(null);
    /* Queued work belongs to the person who tapped it. Sending it under the
       next supervisor's name would put the wrong name in the audit trail, so
       it goes with them. */
    await Promise.all([clearSession(), clearCache(), clearQueue()]);
    setPending(0);
  }, []);

  /* One flush at a time. Two overlapping runs would both read the same queue
     and send the same changes twice — harmless thanks to the idempotency
     keys, but it doubles the traffic on exactly the connection least able to
     afford it. */
  const syncing = useRef(false);

  const sync = useCallback(async () => {
    const current = tokenRef.current;
    if (!current || syncing.current) return;

    syncing.current = true;
    let result;
    try {
      result = await flushQueue(current);
    } finally {
      syncing.current = false;
    }
    setPending(result.remaining);
    if (result.rejected.length > 0) {
      /* Only the latest reason. A supervisor needs to know something did not
         save and why, not a growing list they cannot act on individually. */
      setRejection(result.rejected[result.rejected.length - 1]);
    }
    if (result.unauthorized) await signOut();
  }, [signOut]);

  /* ---- keep the pending count honest, and send promptly ----
     Subscribing rather than polling: a tap made with no signal has to show up
     in the bar immediately, not on the next sync tick.

     It also kicks a flush. Without this a tap made WITH signal still sat in
     the queue until the 60-second timer came round, so the bar read "waiting
     to sync" for up to a minute on a perfectly good connection — which looks
     exactly like the app being broken. Debounced so a burst of taps (marking
     a whole hold) goes out as one batch rather than one request each. */
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const unsubscribe = subscribe((queue) => {
      setPending(queue.length);
      if (queue.length === 0) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void syncRef.current?.(), 800);
    });
    return () => {
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  syncRef.current = sync;

  /* ---- restore the stored session ---- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await loadSession();
      const queue = await readQueue();
      if (cancelled) return;
      if (stored) {
        setToken(stored.token);
        setUser(stored.user);
      }
      setPending(queue.length);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---- flush on reconnect, on foreground, and periodically ---- */
  useEffect(() => {
    if (!token) return;

    void sync();

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) void sync();
    });

    const appState = AppState.addEventListener("change", (next) => {
      if (next === "active") void sync();
    });

    /* A backstop for the case NetInfo reports connected but the connection is
       a dock wifi that answers DNS and nothing else. */
    const timer = setInterval(() => void sync(), 60_000);

    return () => {
      unsubscribe();
      appState.remove();
      clearInterval(timer);
    };
  }, [token, sync]);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await api.login(email.trim(), password);
    await saveSession(result.token, result.user);
    setToken(result.token);
    setUser(result.user);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({ token, user, ready, signIn, signOut }),
    [token, user, ready, signIn, signOut],
  );

  return (
    <SafeAreaProvider>
      <SessionContext.Provider value={value}>
        <StatusBar style="light" />
        <Gate ready={ready} signedIn={Boolean(token)} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.navy },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "700" },
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="vessels/index" options={{ title: "My vessels" }} />
          <Stack.Screen name="vessels/[id]" options={{ title: "Vessel" }} />
        </Stack>
        {rejection && (
          <RejectedBar
            message={rejection.message}
            count={rejection.count}
            onDismiss={() => setRejection(null)}
          />
        )}
        {pending > 0 && <PendingBar count={pending} />}
      </SessionContext.Provider>
    </SafeAreaProvider>
  );
}

/**
 * Sends people to the right place when the session appears or disappears.
 *
 * A component rather than logic inside the layout body, because redirecting
 * has to happen after the navigator has mounted — doing it during the first
 * render throws.
 */
function Gate({ ready, signedIn }: { ready: boolean; signedIn: boolean }) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    /* `useSegments` is typed against the known routes, so this reads the
       first segment rather than the array length — the index route has no
       first segment, and comparing lengths does not typecheck. */
    const first = segments[0] as string | undefined;
    const onLogin = first === "login";
    const onIndex = first === undefined;

    if (!signedIn && !onLogin) router.replace("/login");
    if (signedIn && (onLogin || onIndex)) router.replace("/vessels");
  }, [ready, signedIn, segments, router]);

  return null;
}

/**
 * A standing count of work still on the device.
 *
 * Deliberately always visible while anything is queued. A supervisor walking
 * off a vessel needs to know at a glance that their taps have not left the
 * phone yet, without opening anything.
 */
function PendingBar({ count }: { count: number }) {
  return (
    <View style={styles.pending} accessibilityRole="alert">
      <Text style={styles.pendingText}>
        {count} update{count === 1 ? "" : "s"} waiting to sync — safe on this
        phone
      </Text>
    </View>
  );
}

/**
 * Something the server refused.
 *
 * Red and dismissible, above the pending count, because it is the one piece
 * of sync news a supervisor has to act on — the work is not saved and will
 * not save itself. Silence here is how someone walks off a vessel believing a
 * hold was signed off.
 */
function RejectedBar({
  message,
  count,
  onDismiss,
}: {
  message: string;
  count: number;
  onDismiss: () => void;
}) {
  return (
    <Pressable
      onPress={onDismiss}
      accessibilityRole="alert"
      accessibilityLabel={`${count} update${count === 1 ? "" : "s"} not saved. ${message}. Tap to dismiss.`}
      style={styles.rejected}
    >
      <Text style={styles.rejectedText}>
        {count} update{count === 1 ? "" : "s"} not saved — {message}
      </Text>
      <Text style={styles.rejectedHint}>Tap to dismiss</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rejected: {
    backgroundColor: "#fee2e2",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#fca5a5",
  },
  rejectedText: {
    color: "#991b1b",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  rejectedHint: {
    marginTop: 2,
    color: "#b91c1c",
    fontSize: 11,
    textAlign: "center",
  },
  pending: {
    backgroundColor: "#fde68a",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pendingText: {
    color: "#78350f",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
