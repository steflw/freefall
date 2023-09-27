import { Jump, realmConfig } from "../realm/model";
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

export async function processJumpFile(realm, file: JumpFileRaw) {
  console.log(file.id);
  console.log("file fields", Object.keys(file));
  // console.log("file", file);
  // await deleteAllFiles()
  const altitudeData = JSON.parse(file.altitude) as JumpFile["altitude"];
  // console.log({ altitudeData });
  const locationData = JSON.parse(file.location) as JumpFile["location"];
  console.log(altitudeData.length, locationData.length);
  console.log("locationData", locationData);
  console.log("locationData", locationData[0]);
  try {
    realm.write(() => {
      realm.create("Jump", {
        _id: file.id,
        id: file.id,
        name: "test",
        timestamp: file.unixTimestamp,
        location: locationData,
        altitude: altitudeData,
      })
    });
    deleteFile(file[0].url);
  } catch (e) {
    console.log("Error storing Jump", {e})
  }
}
