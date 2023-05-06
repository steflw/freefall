import * as FileSystem from "expo-file-system";

import { useState, useEffect } from "react";
import * as w from "react-native-watch-connectivity";

import { create } from 'zustand'

type WatchStoreType = {
  watchReachability: boolean;
  setWatchReachability: (reachability: boolean) => void;
}

const usewatchStore = create<WatchStoreType>()((set) => ({
  watchReachability: false,
  setWatchReachability: (reachability) => set({ watchReachability: reachability }),
}))

w.watchEvents.on("reachability", async (reachability) => {
  usewatchStore.getState().setWatchReachability(reachability)
});

w.watchEvents.on("file-received", async (file) => {
  console.log("file-received event", file);
  try {
    const fetchedRes = await FileSystem.readAsStringAsync(file[0].url);
    console.log("fetchedRes", fetchedRes);
  } catch (error) {
    console.error("file received event error", error);
  }
});

w.watchEvents.on("file", async (file) => {
  console.log("file event", file);
});

w.watchEvents.on("file-received-error", async (error) => {
  console.log("file-received-error event", error);
});

const FILES_RECEIVED_DIR = FileSystem.documentDirectory + "/FilesReceived";

async function readDirectory() {
  const files = await FileSystem.readDirectoryAsync(FILES_RECEIVED_DIR);
  console.log("files", files);
  return files;
}

async function deleteFile(fileUri) {
  try {
    await FileSystem.deleteAsync(fileUri);
    console.log("File deleted:", fileUri);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

async function deleteAllFiles() {
  const files = await readDirectory();
  files.forEach(async (file) => {
    await deleteFile(`${FILES_RECEIVED_DIR}/${file}`);
  });
}
