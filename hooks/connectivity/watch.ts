import { NativeModules } from "react-native";

const { WatchSessionModule } = NativeModules;
import * as FileSystem from 'expo-file-system';

console.log({ WatchSessionModule });

import { useState, useEffect } from "react";
import * as w from "react-native-watch-connectivity";

type UseWatchReturnType = {
  watchReachability: boolean;
};

export const useWatch = (): UseWatchReturnType => {
  const [reachability, setReachability] = useState<boolean>(false);

  useEffect(() => {
    w.watchEvents.on("reachability", (reachability) => {
      setReachability(reachability);
    });
    w.watchEvents.on("file", async (file) => {
      console.log({ file });

    });
    w.watchEvents.on("file-received", async (file) => {
      console.log({ fileReceived: file });
      
      try {
        const fetchedRes = await FileSystem.readAsStringAsync(file[0].url)
        console.log({fetchedRes})
      } catch (error) {
        console.error('file received error', error);
      }
    });
    w.watchEvents.on("file-received-error", (error) => {
      console.log({ error });
    });

    return () => {};
  }, []);

  return {
    watchReachability: reachability,
  };
};
