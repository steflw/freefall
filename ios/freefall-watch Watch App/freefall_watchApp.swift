//
//  freefall_watchApp.swift
//  freefall-watch Watch App
//
//  Created by Stefan Wawrzyniak on 13/03/2023.
//

import Foundation
import SwiftUI
import CoreLocation
import CoreData

@main
struct freefall_Watch_AppApp: App {
  let persistenceController = PersistenceController.shared
  var body: some Scene {
    WindowGroup {
      ContentView(context: persistenceController.container.viewContext).environment(\.managedObjectContext, persistenceController.container.viewContext)
    }
  }
}

struct ContentView: View {
  @Environment(\.managedObjectContext) private var viewContext
  @ObservedObject var jumpManager: JumpManager
  
  @FetchRequest(
    sortDescriptors: [NSSortDescriptor(keyPath: \Jump.timestamp, ascending: true)],
    animation: .default)
  private var jumps: FetchedResults<Jump>
  
  init(context: NSManagedObjectContext) {
    self.jumpManager = JumpManager(context: context)
  }
  
  var body: some View {
    VStack {
      NavigationStack {
        List {
          ControlsView(jumpManager: jumpManager)
          ForEach(jumps.reversed()){
            jump in  NavigationLink(formatDate(date: jump.timestamp ?? Date()), value: jump)
          }
        }.navigationTitle("Jumps").navigationDestination(for: Jump.self) {jump in JumpDetailView(jump: jump)
        }
      }
    }
  }
}

class JumpManager: NSObject, ObservableObject {
  var context: NSManagedObjectContext
  @ObservedObject var sensors = SensorManager()
  @Published var active: Bool = false
  @ObservedObject var phoneConnector: PhoneConnector
  
  var startTime: Date = Date()
  
  init(context: NSManagedObjectContext) {
    self.context = context
    self.phoneConnector = PhoneConnector(context: context)
  }
  
  func start() {
    startTime = Date()
    sensors.start()
    self.active = true
  }
  
  func stop() {
    sensors.stop()
    storeJump()
    
    sensors.reset()
    self.active = false
  }
  
  func storeJump() {
    let newReading = Jump(context: context)
    newReading.timestamp = self.startTime
    newReading.unixTimestamp = self.startTime.timeIntervalSince1970
    
    let jsonEncoder = JSONEncoder()
    print("altiReadings", sensors.altiManager.altiReadings)
    do {
      let jsonData = try jsonEncoder.encode(sensors.altiManager.altiReadings)
      let jsonString = String(data: jsonData, encoding: .utf8)
      newReading.altitude = jsonString ?? ""
      print(jsonString ?? "Failed to convert JSON data to string.")
    } catch {
      print("Failed to encode altitude data to JSON: \(error)")
    }
    
    do {
      let jsonData = try jsonEncoder.encode(sensors.locationManager.locationReadings)
      let jsonString = String(data: jsonData, encoding: .utf8)
      newReading.location = jsonString ?? ""
      print(jsonString ?? "Failed to convert JSON data to string.")
    } catch {
      print("Failed to encode location data to JSON: \(error)")
    }
    var jumpId = UUID()
    //    newReading.accelerometer = sensors.accelerometer.accelerometerData
    newReading.id = jumpId
    do {
      try context.save()
      
      // Add jump id to user defaults
      var queuedJumpIDs = UserDefaults.standard.array(forKey: "queuedJumpIds") as? [Data] ?? []
      if let jumpIDData = jumpId.uuidString.data(using: .utf8) {
        print("appending ID: ", jumpIDData)
        queuedJumpIDs.append(jumpIDData)
        UserDefaults.standard.set(queuedJumpIDs, forKey: "queuedJumpIds")
      }
    } catch {
      // Replace this implementation with code to handle the error appropriately.
      // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
      let nsError = error as NSError
      print("ERROR:", nsError)
      print("ERROR:", nsError.userInfo)
      //        fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
    }
  }
}

struct JumpData: Codable {
  let timestamp: TimeInterval
  let altitudes: [AltimeterReading]
}

public struct AltimeterReading: Codable {
  let timestamp: TimeInterval
  let relativeAltitude: String
}
