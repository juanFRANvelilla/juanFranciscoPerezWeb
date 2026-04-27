import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Inicialmente en dark theme (checked)
  isDarkTheme = signal(true);

  toggleTheme() {
    this.isDarkTheme.update(val => !val);
  }
}
