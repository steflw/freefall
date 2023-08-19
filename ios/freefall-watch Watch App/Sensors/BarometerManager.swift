//
//  BarometerManager.swift
//  freefall Watch App
//
//  Created by Stefan Wawrzyniak on 25/02/2023.
//

import Foundation
import CoreMotion

class FreefallDetector: ObservableObject {
  let altimeter = CMAltimeter()
  var altiReadings: [AltimeterReading] = []
  
  
  func startDetection() {
    let queue = OperationQueue()
    queue.qualityOfService = .background
    queue.maxConcurrentOperationCount = OperationQueue.defaultMaxConcurrentOperationCount
    
    altimeter.startRelativeAltitudeUpdates(to: queue,
                                           withHandler: { data, error in
      guard error == nil else { return }
      guard let data = data else { return }
      
      self.altiReadings.append(AltimeterReading(timestamp: Date().timeIntervalSince1970, relativeAltitude: data.relativeAltitude.stringValue))
    })
  }
  
  func stopDetection() {
    altimeter.stopRelativeAltitudeUpdates()
    altimeter.stopAbsoluteAltitudeUpdates()
  }
}

func sensorToUnixTimestamp(sensorTimestamp: TimeInterval) -> TimeInterval {
    // Get the time when the system was last booted
    let unixTimestamp = Date().timeIntervalSince1970 - ProcessInfo.processInfo.systemUptime
    return unixTimestamp
}
