import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "../src/api";
import { useSession } from "../src/session";
import { Banner, Button, Card } from "../src/components/ui";
import { colors, radius, space, TAP } from "../src/theme";

/**
 * The crew door.
 *
 * Supervisors only — the API is told to admit that role alone, so an office
 * account typing its details here is told where it belongs rather than that
 * its password is wrong. That distinction is the difference between a
 * five-second correction and a call to the office.
 */
export default function Login() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (busy) return;
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }

    setBusy(true);
    try {
      await signIn(email, password);
    } catch (err) {
      if (err instanceof ApiError) {
        /* The API writes these for a person to read — "that is an office
           account, sign in at the admin login" and so on. Rewriting them here
           would put the same sentence in two codebases. */
        setError(
          err.code === "offline" || err.code === "timeout"
            ? "Cannot reach CleanTrack. Check your signal and try again — the service can take up to a minute to wake."
            : err.message,
        );
      } else {
        setError("Sign-in failed. Try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.eyebrow}>CLEANSHIP</Text>
            <Text style={styles.title}>CleanTrack</Text>
            <Text style={styles.subtitle}>
              Update hold and tank cleaning from the vessel.
            </Text>
          </View>

          <Card style={{ padding: space.lg, gap: space.md }}>
            {error && <Banner tone="error">{error}</Banner>}

            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="username"
                placeholder="you@cleanship.co"
                placeholderTextColor={colors.faint}
                style={styles.input}
                editable={!busy}
              />
            </View>

            <View>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                textContentType="password"
                style={styles.input}
                editable={!busy}
                onSubmitEditing={submit}
                returnKeyType="go"
              />
            </View>

            <Button
              label={busy ? "Signing in…" : "Sign in"}
              onPress={submit}
              busy={busy}
            />
          </Card>

          <Text style={styles.footnote}>
            Office staff sign in on the website. Customers need no account —
            they open the link they were sent.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: space.lg, justifyContent: "center", flexGrow: 1 },
  header: { alignItems: "center", marginBottom: space.xl },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    color: colors.blue,
  },
  title: {
    marginTop: space.sm,
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    marginTop: space.sm,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
  label: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  input: {
    minHeight: TAP,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    /* 16pt minimum: anything smaller and Android's autofill and accessibility
       zoom both fight the layout. */
    fontSize: 16,
    color: colors.text,
    backgroundColor: "#fff",
  },
  footnote: {
    marginTop: space.xl,
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 19,
  },
});
