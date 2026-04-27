import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from './shared/theme-toggle/theme-toggle.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggleComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly theme = inject(ThemeService);
  readonly isDarkTheme = this.theme.isDark;

  toggleTheme() {
    this.theme.toggle();
  }
}
