import * as FileSystem from "expo-file-system";

import { useState, useEffect } from "react";
import * as w from "react-native-watch-connectivity";

import { create } from 'zustand'

type WatchStoreType = {
  watchReachability: boolean;
  setWatchReachability: (reachability: boolean) => void;
}

const useWatchStore = create<WatchStoreType>()((set) => ({
  watchReachability: false,
  setWatchReachability: (reachability) => set({ watchReachability: reachability }),
}))

w.watchEvents.on("reachability", async (reachability) => {
  useWatchStore.getState().setWatchReachability(reachability)
});

w.watchEvents.on("file-received", async (file) => {
  try {
    const fetchedRes = await FileSystem.readAsStringAsync(file[0].url);
    const parsedRes = JSON.parse(fetchedRes)
    processJumpFile(parsedRes)
  } catch (error) {
    console.error("file received event error", error);
  }
});

type JumpFile = {
  id: string;
  unixTimestamp: number;
  location: [];
  altitude: [];
}

async function processJumpFile(file: JumpFile) {
  console.log('file fields', Object.keys(file))
  console.log('file.unixtimestamp', file.unixTimestamp)
  console.log('file.location length', file?.location.length)
  console.log('file.altitude length', file?.altitude.length)
  // await deleteAllFiles()
  // console.log('file to process', file)
}

w.watchEvents.on("file", async (file) => {
  console.log("FILE EVENT");
});

w.watchEvents.on("file-received-error", async (error) => {
  console.log("FILE RECEIVED ERROR EVENT");
  // deleteAllFiles();
});

const FILES_RECEIVED_DIR = FileSystem.documentDirectory + "/FilesReceived";

async function readDirectory() {
  const files = await FileSystem.readDirectoryAsync(FILES_RECEIVED_DIR);
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
