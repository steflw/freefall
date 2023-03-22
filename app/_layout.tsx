import { Slot } from "expo-router";

import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { Link, Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { useEffect } from "react";
import AuthProvider from "../auth/provider";

const tokenCache = {
  getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return null;
    }
  },
};

function useProtectedRoute(user) {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, []);
}

export default function RootLayout() {
  // useProtectedRoute();
  return (
    <ClerkProvider
      publishableKey="pk_test_Z3JhdGVmdWwtb2N0b3B1cy00NS5jbGVyay5hY2NvdW50cy5kZXYk"
      tokenCache={tokenCache}
    >
      {/* <AuthProvider> */}
        {/* <Stack> */}
        <Slot />
        {/* </Stack> */}
      {/* </AuthProvider> */}
    </ClerkProvider>
  );
}
