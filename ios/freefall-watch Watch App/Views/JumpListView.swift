//
//  JumpListView.swift
//  freefall Watch App
//
//  Created by Stefan Wawrzyniak on 03/03/2023.
//

import SwiftUI

struct JumpsListView: View {
  var jumps: FetchedResults<Jump>
  var body: some View {
    List {
//      ControlsView(jumpManager: <#T##JumpManager#>)
      ForEach(jumps){
        jump in  NavigationLink(formatDate(date: jump.timestamp ?? Date()), value: jump)
      }
    }.navigationTitle("Jumps").navigationDestination(for: Jump.self) {jump in JumpDetailView(jump: jump)
    }
//    List(jumps) {
//
//    }
  }
}

func formatDate(date: Date) -> String {
  var strDate = ""
  let dateFormatter = DateFormatter()
  let timezone = TimeZone.current.abbreviation() ?? "CET"  // get current TimeZone abbreviation or set to CET
  dateFormatter.timeZone = TimeZone(abbreviation: timezone) //Set timezone that you want
  dateFormatter.locale = NSLocale.current
  dateFormatter.dateFormat = "dd.MM.yyyy HH:mm" //Specify your format that you want
  strDate = dateFormatter.string(from: date)
  return strDate
}
