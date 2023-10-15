//
//  PhoneConnector.swift
//  freefall-watch Watch App
//
//  Created by Stefan Wawrzyniak on 21/03/2023.
//

import Foundation
import WatchKit
import WatchConnectivity

final class PhoneConnector: NSObject, ObservableObject {
  var session: WCSession
  @Published var receivedMessage = "Waiting..."
  
  init(session: WCSession  = .default) {
    self.session = session
    super.init()
    if WCSession.isSupported() {
      print("isSupported...")
      session.delegate = self
      session.activate()
    } else {
      print("IS NOT SUPPORTED")
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
  
  func sessionReachabilityDidChange(_ session: WCSession) {
    
  }
}

