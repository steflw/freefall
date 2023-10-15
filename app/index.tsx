import { View, Text, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../watch/connectivity";
import { useLocationPermissions } from "../hooks/useLocationPermissions";
import dayjs from "dayjs";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import {  useRouter } from "expo-router";

import { Jump } from "../realm/model";
import { useQuery } from "@realm/react";
import { useWatchEvents } from "../watch/connectivity";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const [appIsReady, setAppIsReady] = useState(false);
  const hasLocationPermissions = useLocationPermissions();
  useWatchEvents();
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top + 40 }]}>
      <JumpList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
});

const JumpList = () => {
  const query = useQuery<Jump>("Jump").sorted("timestamp", true);
  const router = useRouter();

  const navigateToJump = useCallback((id: string) => {
    router.push(`/jump/${id}`);
  }, []);

  const renderItem = (props) => {
    return <JumpListItem navigateToJump={navigateToJump} {...props} />;
  }

  return (
    <FlatList
      data={query}
      extraData={{ navigateToJump }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      keyExtractor={(item) => String(item._id)}
      renderItem={renderItem}
    />
  );
};

function JumpListItem({item, navigateToJump}) {
  return (
    <TouchableOpacity
      style={{ height: 40, justifyContent: "center" }}
      onPress={() => navigateToJump(item._id)}
    >
      <View key={String(item._id)} style={{}}>
        <Text style={{ fontFamily: "JBMono-SemiBold" }}>
          {dayjs.unix(item.timestamp).format("DD/MM/YY HH:mm")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
