import { View, Text, StyleSheet } from "react-native";
import React from "react";
import "../watch/connectivity";
import { useLocationPermissions } from "../hooks/useLocationPermissions";
import dayjs from "dayjs";
import { Jump } from "../realm/model";

import { FlashList } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useQuery } from "@realm/react";
import { Link } from "expo-router";
import { Href } from "expo-router/src/link/href";

export default function Home() {
  // const hasLocationPermissions = useLocationPermissions();
  // access jumps from realm

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <JumpList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
});

const JumpList = () => {
  const query = useQuery<Jump>("Jump");
  console.log(query);

  return (
    <FlashList
      data={query}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      keyExtractor={(item) => String(item._id)}
      renderItem={JumpListItem}
      estimatedItemSize={39}
    />
  );
};

function JumpListItem({ item }) {
  console.log({ item });
  return (
    <Link href={{ pathname: `/jump/${item._id}` } as Href}>
      <TouchableOpacity
        style={{ height: 40, justifyContent: "center" }}
        onPress={() => {}}
      >
        <View key={String(item._id)} style={{}}>
          <Text>{dayjs.unix(item.timestamp).format("DD/MM/YY HH:mm")}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
