//
//  JumpView.swift
//  freefall Watch App
//
//  Created by Stefan Wawrzyniak on 02/03/2023.
//

import SwiftUI

struct JumpDetailView: View {
//  @ObservedObject var phoneConnector = PhoneConnector()

  var jump: Jump
  var body: some View {
    VStack {
//      Text("Location: " + String(jump.location?.count ?? 0)).font(.body).fontWeight(.light)
//      Text("Barometer: " + String(jump.altitude?.count ?? 0)).font(.body).fontWeight(.light)
      Text("Accelerometer : " + String(jump.accelerometer?.count ?? 0)).font(.body).fontWeight(.light)
    }.navigationTitle(formatDate(date: jump.timestamp ?? Date())).font(.headline)
    Button("Send jump") {
//      self.sendFile(jump: jump)
    }
  }
}

func formatDate(date: Date) -> String {
  var strDate = ""
  let dateFormatter = DateFormatter()
  let timezone = TimeZone.current.abbreviation() ?? "GMT"  // get current TimeZone abbreviation or set to CET
  dateFormatter.timeZone = TimeZone(abbreviation: timezone) //Set timezone that you want
  dateFormatter.locale = NSLocale.current
  dateFormatter.dateFormat = "dd.MM.yyyy HH:mm" //Specify your format that you want
  strDate = dateFormatter.string(from: date)
  return strDate
}
