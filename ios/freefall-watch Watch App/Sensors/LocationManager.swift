//
//  LocationManager.swift
//  freefall Watch App
//
//  Created by Stefan Wawrzyniak on 25/02/2023.
//

import Foundation
import CoreLocation

class LocationManagerService: NSObject, ObservableObject, CLLocationManagerDelegate {
  var manager: CLLocationManager = CLLocationManager()
  @Published var location: CLLocation?
  @Published var enabled: Bool = false
  var locationReadings: [LocationData] = []

  override init() {
    super.init()
    manager.delegate = self
    self.manager.allowsBackgroundLocationUpdates  = true
    //    self.manager.desiredAccuracy = kCLLocationAccuracyBest
    self.manager.desiredAccuracy = kCLLocationAccuracyBestForNavigation
  }
  
  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    location = locations.first
    print("location", location)
    self.locationReadings.append(LocationData(latitude: location?.coordinate.latitude, longitude: location?.coordinate.longitude, timestamp: Date().timeIntervalSince1970, speed: location?.speed, speedAccuracy: location?.speedAccuracy, course: location?.course))
  }
  
  func locationManager(
    _ manager: CLLocationManager,
    didFailWithError error: Error
  ) {
    // Handle failure to get a user’s location
    print("error", error)
  }
  
  func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
    //    enabled = CLLocationManager.locationServicesEnabled() // dont use on main thread implement
    //    print("on change enabled: ", enabled)
  }
}

struct LocationData: Codable {
    let latitude: Double?
    let longitude: Double?
    let timestamp: Double?
    let speed: Double?
    let speedAccuracy: Double?
    let course: Double?
}
