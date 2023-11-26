//
//  PhoneConnector.swift
//  freefall-watch Watch App
//
//  Created by Stefan Wawrzyniak on 21/03/2023.
//

import Foundation
import WatchKit
import WatchConnectivity
import CoreData

final class PhoneConnector: NSObject, ObservableObject {
  var session: WCSession
  @Published var receivedMessage = "Waiting..."
  let context: NSManagedObjectContext
  
  init(session: WCSession  = .default, context: NSManagedObjectContext) {
    self.session = session
    self.context = context
    super.init()
    if WCSession.isSupported() {
      session.delegate = self
      session.activate()
    } else {
      print("IS NOT SUPPORTED")
    }
  }
  
  func sessionReachabilityDidChange(_ session: WCSession) {
    print("---- Reachability changed ---")
    if session.isReachable {
      sendQueuedJumps()
    }
  }
  
  func sendQueuedJumps() {
    guard session.isReachable else {
      return
    }
    
    var test = UserDefaults.standard.array(forKey: "queuedJumpIds") as? [Data] ?? []
    print("test", test)
    var queuedJumpIDs = test.compactMap { UUID(uuidString: String(data: $0, encoding: .utf8) ?? "") }
    print("sendQueuedJumps: queuedJumpIDs", queuedJumpIDs)
    let jumps = fetchJumps(withIDs: queuedJumpIDs)
    print("Jumps from context", jumps)
    for jump in jumps {
      // Send the jump to the iPhone
      sendFile(jump: jump)
      
      // Remove the jump ID from the queue
      if let jumpID = jump.id {
        if let index = queuedJumpIDs.firstIndex(of: jumpID) {
          print("Removing queued ID", jump.id)
          queuedJumpIDs.remove(at: index)
        }
      }
    }
    UserDefaults.standard.set(queuedJumpIDs, forKey: "queuedJumpIds")
  }
  
  func fetchJumps(withIDs jumpIDs: [UUID]) -> [Jump] {
    let fetchRequest: NSFetchRequest<Jump> = Jump.fetchRequest()
    fetchRequest.predicate = NSPredicate(format: "id IN %@", jumpIDs)
    do {
      let jumps = try self.context.fetch(fetchRequest)
      return jumps
    } catch {
      let nsError = error as NSError
      print("Failed to fetch jumps: \(nsError), \(nsError.userInfo)")
      return []
    }
  }
  

  // TODO: Apparently files queue... Attemp to try this withou session reachability?
  // Background transfer? 

  
  private func sendFile(jump: Jump) {
    print("send message")
    do {
      let jsonEncoder = JSONEncoder()
      let jsonData = try jsonEncoder.encode(jump)
      let fileURL = FileManager.default
        .urls(for: .documentDirectory, in: .userDomainMask)
        .first!
        .appendingPathComponent((jump.id?.uuidString ?? "json")+".json")
      try jsonData.write(to: fileURL)
      self.session.transferFile(fileURL, metadata: nil)
      
    } catch {
      let nsError = error as NSError
      print("Error writing person JSON to file: \(error.localizedDescription)")
      print("ERROR when reading:", nsError)
      print("ERROR when reading:", nsError.userInfo)
    }
  }
}

extension PhoneConnector: WCSessionDelegate {
  // Session handler
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    print("session", session)
  }
  
  // Reply handler
  func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
    print("testing")
    replyHandler(["text": "Here is your reply"])
    print("message", message)
    print("message[text]", message["text"])
    guard let msg = message["text"] as? String else {
      print("type is not string: ", message["text"])
      return
    }
    DispatchQueue.main.async {
      self.receivedMessage = msg
    }
  }
}
