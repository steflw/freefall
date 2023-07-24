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
  
  //  @State var jumps: [Jump] = []
  
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
//        NavigationLink("Record a Jump", destination: ControlsView(jumpManager: jumpManager))
//        NavigationLink("Jumps", destination: JumpsListView(jumps: jumps))
        List {
          ControlsView(jumpManager: jumpManager)
          ForEach(jumps){
            jump in  NavigationLink(formatDate(date: jump.timestamp ?? Date()), value: jump)
          }
        }.navigationTitle("Jumps").navigationDestination(for: Jump.self) {jump in JumpDetailView(jump: jump)
        }
      }
      //        ControlsView(jumpManager: jumpManager)
      //        JumpsListView(jumps: jumps)
    }
  }
}

class JumpManager: NSObject, ObservableObject {
  var context: NSManagedObjectContext
  @ObservedObject var sensors = SensorManager()
  @Published var active: Bool = false
  
  var startTime: Date = Date()
  
  init(context: NSManagedObjectContext) {
    self.context = context
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
    newReading.altitude = sensors.alti.altiReadings
    newReading.location = sensors.locationManager.locationReadings
//    newReading.accelerometer = sensors.accelerometer.accelerometerData
    newReading.id = UUID()
    do {
      try context.save()
    } catch {
      // Replace this implementation with code to handle the error appropriately.
      // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
      let nsError = error as NSError
      print("ERROR:", nsError)
      print("ERROR:", nsError.userInfo)
      //        fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
    }
  }
  
  func getAllReadings() {
    let fetchRequest: NSFetchRequest<Jump> = Jump.fetchRequest()
    
    do {
      let entries = try context.fetch(fetchRequest)
      //      print("Entires:",  entries)
      print("Num of entries:",  entries.count)
      
      for entry in entries {
        print("entry", entry)
        let altitudeReadings = entry.altitude ?? []
//        print("readings: ", entry.timestamp, "Altitude count:", altitudeReadings.count, "Location count", entry.location?.count, "Accelerometer count:", entry.accelerometer?.count)
                print("readings: ", entry.timestamp, "Altitude count:", altitudeReadings.count, "Location count", entry.location?.count)
      }
      
    } catch {
      let nsError = error as NSError
      print("ERROR when reading:", nsError)
      print("ERROR when reading:", nsError.userInfo)
    }
  }
}
