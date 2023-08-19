import Realm from "realm";

import { realmConfig } from "../realm/model";
import { deleteFile } from "./fs";

type JumpFileRaw = {
  id: string;
  unixTimestamp: number;
  location: string;
  altitude: string;
};

type JumpFile = {
  id: string;
  unixTimestamp: number;
  location: [];
  altitude: [];
};

export async function processJumpFile(file: JumpFileRaw) {
  console.log(file.id)
  console.log("file fields", Object.keys(file));
  // console.log("file", file);
  // await deleteAllFiles()
  const altitudeData = JSON.parse(file.altitude) as JumpFile["altitude"];
  // console.log({ altitudeData });
  const locationData = JSON.parse(file.location) as JumpFile["location"];

  try {
    await writeData({
      _id: file.id,
      id: file.id,
      name: "test",
      timestamp: file.unixTimestamp,
      location: locationData,
      altitude: altitudeData,
    });
    // deleteFile(file[0].url);
  } catch (e) {}
}

let realm;

export async function openRealm() {
  // Open the realm.
  realm = await Realm.open(realmConfig);

  return realm;
}

export async function closeRealm() {
  if (realm && !realm.isClosed) {
    realm.close();
  }
  realm = null;
}

export async function writeData(data) {
  // Ensure the realm is open.
  if (!realm) {
    await openRealm();
  }

  // Write to the realm.
  try {
    realm.write(() => {
      realm.create("Jump", data);
    });
  } catch (err) {
    // Handle any errors.
    console.error("Failed to write data to Realm", err);
  } finally {
    // Close the realm.
    await closeRealm();
  }
}
