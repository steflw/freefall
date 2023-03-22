import { View, Text } from 'react-native'
import React, { useCallback } from 'react'
import { useAuth, useSignIn, useSignUp, useClerk } from "@clerk/clerk-expo";
import { useRouter } from 'expo-router';

export default function AuthProvider(props) {
  const { isSignedIn } = useAuth()
  const router = useRouter();
  
  useCallback(
    () => {
      if (!isSignedIn) {
        router.push("/sign-in");
      }
    },
    [isSignedIn],
  )
  
  return props.children
}