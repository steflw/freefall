//
//  ControlsView.swift
//  freefall Watch App
//
//  Created by Stefan Wawrzyniak on 03/03/2023.
//

import SwiftUI

struct ControlsView: View {
  @ObservedObject var jumpManager: JumpManager
    var body: some View {
      VStack(alignment: .leading) {
        Text("Record")
        Button(self.jumpManager.active ? "Stop" : "Start", action: self.jumpManager.active ? self.jumpManager.stop : self.jumpManager.start)
      }
    }
}
