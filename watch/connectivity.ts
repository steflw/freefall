import * as FileSystem from "expo-file-system";
import * as w from "react-native-watch-connectivity";

import { create } from 'zustand'
import { processJumpFile } from "./processfile";
import { deleteFile } from "./fs";

type WatchStoreType = {
  watchReachability: boolean;
  setWatchReachability: (reachability: boolean) => void;
}

const useWatchStore = create<WatchStoreType>()((set) => ({
  watchReachability: false,
  setWatchReachability: (reachability) => set({ watchReachability: reachability }),
}))

w.watchEvents.on("reachability", async (reachability) => {
  console.log("REACHABILITY EVENT", reachability);
  useWatchStore.getState().setWatchReachability(reachability)
});

w.watchEvents.on("file-received", async (file) => {
  try {
    const fetchedRes = await FileSystem.readAsStringAsync(file[0].url);
    const parsedRes = JSON.parse(fetchedRes)
    await processJumpFile(parsedRes)
    deleteFile(file[0].url)
  } catch (error) {
    console.error("file-received event error", error);
  }
});

w.watchEvents.on("file", async (file) => {
  console.log("FILE EVENT");
});

w.watchEvents.on("file-received-error", async (error) => {
  console.log("FILE RECEIVED ERROR EVENT", error);
  // deleteAllFiles();
});
