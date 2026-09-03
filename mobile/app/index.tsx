import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../src/theme";

/**
 * The entry route. It renders nothing but a spinner: the redirect to either
 * the login screen or the vessel list is decided in the root layout, once the
 * stored session has been read off disk.
 */
export default function Index() {
  return (
    <View style={styles.root}>
      <ActivityIndicator size="large" color={colors.navy} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
});
