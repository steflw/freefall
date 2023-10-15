import * as FileSystem from "expo-file-system";
import { watchEvents } from "react-native-watch-connectivity";

import { create } from 'zustand'
import { processJumpFile, sendJumpToAnalyticsService } from "./processfile";
import { deleteFile } from "./fs";
import { useEffect } from "react";
import { useRealm } from "@realm/react";

type WatchStoreType = {
  watchReachability: boolean;
  setWatchReachability: (reachability: boolean) => void;
}

const useWatchStore = create<WatchStoreType>()((set) => ({
  watchReachability: false,
  setWatchReachability: (reachability) => set({ watchReachability: reachability }),
}))

let reachabilityListener
let fileReceivedListener
let fileListener
let fileReceivedErrorListener

function sub(realm: Realm) {
  reachabilityListener = watchEvents.addListener("reachability", async (reachability) => {
    console.log("REACHABILITY EVENT", reachability);
    useWatchStore.getState().setWatchReachability(reachability)
  });
  
  fileReceivedListener =  watchEvents.addListener("file-received", async (file) => {
    try {
      const fetchedRes = await FileSystem.readAsStringAsync(file[0].url);
      const parsedRes = JSON.parse(fetchedRes)
      console.log(parsedRes.location.length)
      processJumpFile(realm, parsedRes)
      sendJumpToAnalyticsService(parsedRes);
      deleteFile(file[0].url)
    } catch (error) {
      console.error("file-received event error", error);
    }
  });
  
  fileListener = watchEvents.addListener("file", async (file) => {
    console.log("FILE EVENT");
  });
  
  fileReceivedErrorListener = watchEvents.addListener("file-received-error", async (error) => {
    console.log("FILE RECEIVED ERROR EVENT", error);
  });
}

export function useWatchEvents() {
  const realm = useRealm()
  useEffect(() => {
    sub(realm)
    return () => {
      reachabilityListener()
      fileReceivedListener()
      fileListener()
      fileReceivedErrorListener()
    }
  }, [])
}