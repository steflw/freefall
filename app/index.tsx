import { View, Text, StyleSheet } from "react-native";
import React from "react";
import "../watch/connectivity";
import { useLocationPermissions } from "../hooks/useLocationPermissions";

import Realm from "realm";
import { createRealmContext } from "@realm/react";
import { Jump, realmConfig } from "../realm/model";


const { RealmProvider, useRealm, useObject, useQuery } =
  createRealmContext(realmConfig);

export default function Home() {
  const hasLocationPermissions = useLocationPermissions();
  // access jumps from realm


  return (
    <RealmProvider>
      <View style={styles.container}>
        <JumpList />
        <Text>Home</Text>
      </View>
    </RealmProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

const JumpList = () => {
  const query = useQuery<Jump>("Jump");
  console.log('query', query);

  query.forEach((jump) => {
    console.log('jump', jump.altitude);
  });


  return null
} 