import { Slot, Stack } from "expo-router";
import { RealmProvider } from "@realm/react";
import { Altitude, Jump, Location, realmConfig } from "../realm/model";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Screen } from "../components/Screen";
import { View } from "react-native";
import React from "react";

export default function RootLayout() {
  return (
    <RealmProvider schema={[Jump, Altitude, Location]}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              title: "Logbook",
              headerShadowVisible: false,
              headerTransparent: true,
              headerBlurEffect: "light",
            }}
          />
        </SafeAreaProvider>
      </View>
    </RealmProvider>
  );
}
