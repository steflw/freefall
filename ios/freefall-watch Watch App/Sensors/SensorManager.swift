//
//  File.swift
//  freefall Watch App
//
//  Created by Stefan Wawrzyniak on 25/02/2023.
//

import Foundation

protocol Sensor {
  func start()
  func stop()
}

class SensorManager: NSObject, ObservableObject {
  var locationManager = LocationManagerService()
  var altiManager = FreefallDetector()
  

  func start() {
    self.locationManager.manager.startUpdatingLocation()
    self.altiManager.startDetection()
  }
  
  func stop() {
    
    self.locationManager.manager.stopUpdatingLocation()
    self.altiManager.stopDetection()
  }
  
  func reset() {
    self.altiManager.altiReadings = []
    self.locationManager.locationReadings = []
  }


}


