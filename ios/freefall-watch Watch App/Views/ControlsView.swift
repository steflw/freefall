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
        Button(self.jumpManager.active ? "Stop recording" : "Start recording", action: self.jumpManager.active ? self.jumpManager.stop : self.jumpManager.start)
    }
}
