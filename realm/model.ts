import Realm from 'realm';

// realm model for jumps
export class Jump extends Realm.Object<Jump> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  timestamp!: number;
  altitude!: Realm.List<Altitude>;
  static schema = {
    name: "Jump",
    properties: {
      _id: "string",
      name: "string",
      timestamp: "int",
      altitude: "Altitude[]",
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

  static schema = {
    name: "Location",
    properties: {
      timestamp: "double",
    }
  };
}

export const realmConfig: Realm.Configuration = {
  schema: [Altitude, Jump],
};
