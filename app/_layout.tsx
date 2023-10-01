import { Slot, Stack } from "expo-router";
import { RealmProvider } from "@realm/react";
import { Altitude, Jump, Location, realmConfig } from "../realm/model";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Screen } from "../components/Screen";
import { View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

export default function RootLayout() {
  // TODO: Extract to useFonts hook
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "JBMono": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
          "JBMono-Bold": require("../assets/fonts/JetBrainsMono-Bold.ttf"),
          "JBMono-SemiBold": require("../assets/fonts/JetBrainsMono-SemiBold.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <RealmProvider schema={[Jump, Altitude, Location]}>
      <View onLayout={onLayoutRootView} style={{ flex: 1, backgroundColor: "white" }}>
        <SafeAreaProvider>
          <Stack

            screenOptions={{
              title: "Logbook",
              headerShadowVisible: false,
              headerTransparent: true,
              headerBlurEffect: "light",
              headerTitleStyle: {
                fontFamily: 'JBMono-Bold'
              },
            }}
          />
        </SafeAreaProvider>
      </View>
    </RealmProvider>
  );
}
