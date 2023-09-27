import { useObject } from "@realm/react";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { Jump } from "../../realm/model";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";

export default function JumpPage() {
  const params = useLocalSearchParams();
  const { top } = useSafeAreaInsets();

  const jump = useObject<Jump>("Jump", params.id as string);
  console.log({ jump });
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ paddingTop: top + 50 }}>
        <Text>{dayjs.unix(jump.timestamp).format("DD/MM/YY HH:mm")}</Text>
        <Text>{jump.altitude.length}</Text>
        <Text>{jump.location.length}</Text>
      </View>
    </View>
  );
}
