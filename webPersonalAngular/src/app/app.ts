import { Component, inject, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
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
  private readonly router = inject(Router);
  readonly isDarkTheme = this.theme.isDark;

  constructor() {
    this.applyShellAttr(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.applyShellAttr(e.urlAfterRedirects));
  }

  private applyShellAttr(url: string) {
    if (typeof document === 'undefined') return;
    const isDebtApp = url.startsWith('/debtapp');
    if (isDebtApp) document.documentElement.setAttribute('data-shell', 'debtapp');
    else document.documentElement.removeAttribute('data-shell');
  }
}
