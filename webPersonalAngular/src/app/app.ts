import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None
})
export class App {
  private readonly theme = inject(ThemeService);
  readonly isDarkTheme = this.theme.isDark;

  toggleTheme() {
    this.theme.toggle();
  }
}
