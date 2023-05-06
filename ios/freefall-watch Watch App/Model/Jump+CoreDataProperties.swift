//
//  Jump+CoreDataProperties.swift
//  freefall Watch App
//
//  Created by Stefan Wawrzyniak on 19/02/2023.
//
//

import Foundation
import CoreData
import CoreMotion
import CoreLocation

extension Jump {
    @nonobjc public class func fetchRequest() -> NSFetchRequest<Jump> {
        return NSFetchRequest<Jump>(entityName: "Jump")
    }

    @NSManaged public var altitude: [CMAltitudeData]?
    @NSManaged public var location: [CLLocation]?
    @NSManaged public var accelerometer: [CMDeviceMotion]?
    @NSManaged public var id: UUID?
    @NSManaged public var timestamp: Date?
}

extension Jump : Identifiable {

}

extension Jump: Encodable {
    enum CodingKeys: String, CodingKey {
        case altitude
        case location
        case accelerometer
        case id
        case timestamp
    }

    public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      try container.encode(self.altitude, forKey: .altitude)
      try container.encode(self.location, forKey: .location)
      try container.encode(self.accelerometer, forKey: .accelerometer)
      try container.encode(timestamp, forKey: .timestamp)
      try container.encode(id, forKey: .id)
    }
}

extension CLLocation: Encodable {
    enum CodingKeys: String, CodingKey {
        case latitude
        case longitude
        case altitude
        case horizontalAccuracy
        case verticalAccuracy
        case speed
        case course
        case timestamp
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(coordinate.latitude, forKey: .latitude)
        try container.encode(coordinate.longitude, forKey: .longitude)
        try container.encode(altitude, forKey: .altitude)
        try container.encode(horizontalAccuracy, forKey: .horizontalAccuracy)
        try container.encode(verticalAccuracy, forKey: .verticalAccuracy)
        try container.encode(speed, forKey: .speed)
        try container.encode(course, forKey: .course)
        try container.encode(timestamp, forKey: .timestamp)
    }
}

extension CMAltitudeData: Encodable {
  enum CodingKeys: String, CodingKey {
      case relativeAltitude
      case timestamp
  }

  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(String(describing: relativeAltitude) as String, forKey: .relativeAltitude)
    try container.encode(timestamp, forKey: .timestamp)
  }
}



extension CMDeviceMotion: Encodable {
  enum CodingKeys: String, CodingKey {
      case gravity
      case timestamp
  }

  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(gravity, forKey: .gravity)
    try container.encode(timestamp, forKey: .timestamp)
  }
}

extension CMAcceleration: Encodable {
  enum CodingKeys: String, CodingKey {
      case x
      case y
      case z
    
  }

  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(x, forKey: .x)
    try container.encode(y, forKey: .y)
    try container.encode(z, forKey: .z)
  }
}
