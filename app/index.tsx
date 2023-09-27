import { View, Text, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import "../watch/connectivity";
import { useLocationPermissions } from "../hooks/useLocationPermissions";
import dayjs from "dayjs";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  FlashList,
  ListRenderItem,
  ListRenderItemInfo,
} from "@shopify/flash-list";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Link, useRouter } from "expo-router";

import { Jump, realmConfig } from "../realm/model";
import { useQuery } from "@realm/react";
import { useWatchEvents } from "../watch/connectivity";




export default function Home() {
  // TODO: add location permissions
  // const hasLocationPermissions = useLocationPermissions();
  useWatchEvents()
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
  const query = useQuery<Jump>("Jump");
  const router = useRouter();
  console.log({ query });
  const navigatetoJump = useCallback((id: string) => {
    router.push(`/jump/${id}`);
  }, []);

  return (
    <FlashList
      data={query}
      extraData={{ navigatetoJump }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      keyExtractor={(item) => String(item._id)}
      renderItem={JumpListItem}
      estimatedItemSize={39}
    />
  );
};

function JumpListItem({ item, extraData }: ListRenderItemInfo<Jump>) {
  return (
    <TouchableOpacity
      style={{ height: 40, justifyContent: "center" }}
      onPress={() => extraData.navigatetoJump(item._id)}
    >
      <View key={String(item._id)} style={{}}>
        <Text>{dayjs.unix(item.timestamp).format("DD/MM/YY HH:mm")}</Text>
      </View>
    </TouchableOpacity>
  );
}
