import { Stack } from "expo-router";
import { RealmProvider, createRealmContext } from "@realm/react";
import { Altitude, Jump, realmConfig } from "../realm/model";
// const { RealmProvider, useRealm, useObject, useQuery } =
//   createRealmContext(realmConfig);

export default function RootLayout() {
  return (
    <RealmProvider schema={[Jump, Altitude]}>
      <Stack screenOptions={{
        
      }} />
    </RealmProvider>
  );
}
