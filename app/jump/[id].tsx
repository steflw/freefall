import { useObject, useQuery, useRealm } from "@realm/react";
import dayjs from "dayjs";
import { useLocalSearchParams, useSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { Jump } from "../../realm/model";

export default function JumpPage(...props) {
  const params = useLocalSearchParams();

  // get jump by id from realm
  const jump = useObject<Jump>("Jump", params.id as string);
  console.log({ jump });
  return (
    <View>
      <Text>{dayjs.unix(jump.timestamp).format("DD/MM/YY HH:mm")}</Text>
      <Text>{jump.altitude.length}</Text>
      {/* TODO: add location to realm */}
    </View>
  );
}
