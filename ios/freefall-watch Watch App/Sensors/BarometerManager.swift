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
  var previousAltitudes = [NSNumber](repeating: 0.0, count: 3)
  var currentIndex = 0
  
  var prevTime = 0.0
  var delay = 0.0
  
  var altiReadings: [CMAltitudeData] = []
  
  
  func startDetection() {
    let queue = OperationQueue()
    queue.qualityOfService = .background
    queue.maxConcurrentOperationCount = OperationQueue.defaultMaxConcurrentOperationCount
    
    altimeter.startRelativeAltitudeUpdates(to: queue,
                                           withHandler: { data, error in
      guard error == nil else { return }
      guard let data = data else { return }
      
      self.altiReadings.append(data)
      
      self.delay = (data.timestamp - self.prevTime)
      self.prevTime = data.timestamp
      print(data, self.delay)
    })
  }
  
  func stopDetection() {
    altimeter.stopRelativeAltitudeUpdates()
    altimeter.stopAbsoluteAltitudeUpdates()
  }
}

