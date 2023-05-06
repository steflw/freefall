import { View, Text, StyleSheet } from "react-native";
import React from "react";
import "../hooks/connectivity/watch";
import { useLocationPermissions } from "../hooks/useLocationPermissions";

export default function Home() {
  const hasLocationPermissions = useLocationPermissions();

  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
