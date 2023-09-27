import { Stack } from "expo-router";
import { View } from "react-native";

type ScreenProps = {
  title: string;
};

export const Screen = ({ title }: ScreenProps) => {
  return (
    <Stack
      screenOptions={{
        title,
        headerShadowVisible: false,
        headerTransparent: true,
        headerBlurEffect: "light",
      }}
    />
  );
};
