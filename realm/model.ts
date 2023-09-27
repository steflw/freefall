import Realm from 'realm';

// realm model for jumps
export class Jump extends Realm.Object<Jump> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  timestamp!: number;
  altitude!: Realm.List<Altitude>;
  location!: Realm.List<Location>;
  static schema = {
    name: "Jump",
    properties: {
      _id: "string",
      name: "string",
      timestamp: "int",
      altitude: "Altitude[]",
      location: "Location[]"
    },
    primaryKey: "_id",
  };
}

export class Altitude extends Realm.Object<Altitude> {
  timestamp!: number;
  relativeAltitude!: string;
  static schema = {
    name: "Altitude",
    properties: {
      timestamp: "double",
      relativeAltitude: "string",
    }
  };
}

export class Location extends Realm.Object<Location> {
  timestamp!: number;
  latitude!: number;
  longitude!: number;
  speed!: number;
  course!: number;
  speedAccuracy!: number;
  static schema = {
    name: "Location",
    properties: {
      timestamp: "double",
      latitude: "double",
      longitude: "double",
      speed: "double",
      course: "double",
      speedAccuracy: "double",
    }
  };
}

export const realmConfig: Realm.Configuration = {
  schema: [Altitude, Location, Jump],
};
