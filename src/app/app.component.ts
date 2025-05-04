import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { version as appVersion } from '../../package.json';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgOptimizedImage],
  templateUrl: './app.component.html',
})
export class AppComponent {
  appVersion: string;

  constructor() {
    this.appVersion = appVersion;
  }
}
