import { useObject } from "@realm/react";
import dayjs from "dayjs";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View, Dimensions } from "react-native";
import { Jump } from "../../realm/model";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useMemo, useRef } from "react";
import MapView, { Polyline } from "react-native-maps";

const MAP_EDGE_PADDING = 25;
const STROKE_WIDTH = 4;

const mapMargin = 10;

export default function JumpPage() {
  const params = useLocalSearchParams();
  const { top } = useSafeAreaInsets();

  const jump = useObject<Jump>("Jump", params.id as string);
  console.log({ jump });
  console.log(jump.location);
  const mapRef = useRef(null);
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        jump.location.map(({ latitude, longitude }) => ({
          latitude,
          longitude,
        })),
        {
          edgePadding: {
            top: MAP_EDGE_PADDING,
            right: MAP_EDGE_PADDING,
            bottom: MAP_EDGE_PADDING,
            left: MAP_EDGE_PADDING,
          },
        }
      );
    }
  }, [mapRef]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          title: dayjs.unix(jump.timestamp).format("DD/MM/YY HH:mm"),          
          headerTitleStyle: {
           fontFamily: 'JBMono-Bold'
          },
          headerShadowVisible: false,
          headerTransparent: true,
          headerBlurEffect: "light",
        }}
      />
      <View style={{ paddingTop: top + 50 }}>
        <MapView
          style={{
            width: width - mapMargin * 2,
            height: "60%",
            margin: mapMargin,
            marginTop: 0,
            borderRadius: 15,
          }}
          ref={mapRef}
        >
          <Polyline
            strokeColor="#000000"
            strokeWidth={STROKE_WIDTH}
            coordinates={jump.location.map(({ latitude, longitude }) => ({
              latitude,
              longitude,
            }))}
          />
        </MapView>
        <View style={{ margin: mapMargin }}>
        <Text style={{ fontFamily: 'JBMono' }}>Altitude readings: {jump.altitude.length}</Text>
        <Text style={{ fontFamily: 'JBMono' }}>Location readings: {jump.location.length}</Text>
        </View>
      </View>
    </View>
  );
}
