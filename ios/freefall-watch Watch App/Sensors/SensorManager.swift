//
//  File.swift
//  freefall Watch App
//
//  Created by Stefan Wawrzyniak on 25/02/2023.
//

import Foundation

class SensorManager: NSObject, ObservableObject {
  var locationManager = LocationManagerService()
  var alti = FreefallDetector()
//  var accelerometer = AccelerometerManager()
  

  func start() {
    self.locationManager.manager.startUpdatingLocation()
    self.alti.startDetection()
//    self.accelerometer.start()
  }
  
  func stop() {
    self.locationManager.manager.stopUpdatingLocation()
    self.alti.stopDetection()
//    self.accelerometer.stop()
  }
  
  func reset() {
    self.alti.altiReadings = []
    self.locationManager.locationReadings = []
//    self.accelerometer.accelerometerData = []
  }
}

protocol Sensor {
  func start()
  
  func stop()
}
