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
  // console.log({file})
  console.log("file fields", Object.keys(file));
  const altitudeData = JSON.parse(file.altitude) as JumpFile["altitude"];
  const locationData = JSON.parse(file.location) as JumpFile["location"];
  console.log('num location altitude', altitudeData.length)
  console.log('num location readings', locationData.length)
  const data = {
    _id: file.id,
    id: file.id,
    name: "test",
    timestamp: file.unixTimestamp,
    location: locationData,
    altitude: altitudeData,
  };
  try {
    realm.write(() => {
      realm.create("Jump", data);
    });
    // console.log({data})
    await sendJumpToAnalyticsService(data);
  } catch (e) {
    console.log("Error storing Jump", { e });
  }
}

export async function sendJumpToAnalyticsService(file) {
  try {
    const res = fetch(
      "https://freefall-backend-go-production.up.railway.app/jump",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(file),
      }
    );
    return res;
  } catch (e) {
    console.log("Error sending Jump to analytics service", { e });
  }
}