//
//  JumpView.swift
//  freefall Watch App
//
//  Created by Stefan Wawrzyniak on 02/03/2023.
//

import SwiftUI

struct JumpDetailView: View {
  @ObservedObject var phoneConnector = PhoneConnector()

  var jump: Jump
  var body: some View {
    VStack {
      Text("Location: " + String(jump.location?.count ?? 0)).font(.body).fontWeight(.light)
      Text("Barometer: " + String(jump.altitude?.count ?? 0)).font(.body).fontWeight(.light)
      Text("Accelerometer : " + String(jump.accelerometer?.count ?? 0)).font(.body).fontWeight(.light)
    }.navigationTitle(formatDate(date: jump.timestamp ?? Date())).font(.headline)
    Button("Send jump") {
//      self.sendMessage(jump: jump)
      self.sendFile(jump: jump)
    }
  }
  
  private func sendMessage(jump: Jump) {
    print("send message")
    do {
      let jsonEncoder = JSONEncoder()
      let jsonData = try jsonEncoder.encode(jump)
      let json = String(data: jsonData, encoding: String.Encoding.utf8)
      
      let message: [String: Any] = ["jumpsData": json]
      self.phoneConnector.session.sendMessage(message, replyHandler: nil) { (error) in
        print(error.localizedDescription)
      }
    } catch {
      let nsError = error as NSError
      print("ERROR when reading:", nsError)
      print("ERROR when reading:", nsError.userInfo)
    }
  }

  private func sendFile(jump: Jump) {
    print("send message")
    do {
      let jsonEncoder = JSONEncoder()
      let jsonData = try jsonEncoder.encode(jump)
//      let json = String(data: jsonData, encoding: String.Encoding.utf8)
      
      
      let fileURL = FileManager.default
          .urls(for: .documentDirectory, in: .userDomainMask)
          .first!
          .appendingPathComponent((jump.id?.uuidString ?? "json")+".json")
      try jsonData.write(to: fileURL)
      print("Person JSON written to file at: \(fileURL)")

//      let message: [String: Any] = ["jumpsData": json]
      self.phoneConnector.session.transferFile(fileURL, metadata: nil)
    } catch {
      let nsError = error as NSError
      print("Error writing person JSON to file: \(error.localizedDescription)")
      print("ERROR when reading:", nsError)
      print("ERROR when reading:", nsError.userInfo)
    }
  }
  
//  private func sendMessage(jump: Jump) {
//    print("send message")
//    do {
//      let midpoint = (jump.accelerometer?.count ?? 0) / 2 + 2000
////      jump.accelerometer = Array(jump.accelerometer?[midpoint...] ?? [])
//      jump.accelerometer = []
////      jump.location = []
//      let jumpsData = try JSONEncoder().encode(jump)
//      print("uncompressed", jumpsData.base64EncodedString().lengthOfBytes(using: .utf8))
//      let zipped = try! jumpsData.gzipped(level: .bestCompression)
//      let encoded = zipped.base64EncodedString()
//      print("size in bytes", encoded.lengthOfBytes(using: .utf8))
////      let jumpsString = String(data: jumpsData, encoding: .utf8)
//
////      print("jumpsString", jumpsString)
//      let message: [String: Any] = ["jumpsData": encoded]
//      self.phoneConnector.session.sendMessage(message, replyHandler: nil) { (error) in
//        print(error.localizedDescription)
//      }
//    } catch {
//      let nsError = error as NSError
//      print("ERROR when reading:", nsError)
//      print("ERROR when reading:", nsError.userInfo)
//    }
//  }
}

