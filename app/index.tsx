import { View, Text } from 'react-native'
import React from 'react'
import { useWatch } from '../hooks/connectivity/watch'

export default function Home() {
  const {watchReachability} = useWatch()
  console.log({watchReachability})
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home</Text>
    </View>
  )
}