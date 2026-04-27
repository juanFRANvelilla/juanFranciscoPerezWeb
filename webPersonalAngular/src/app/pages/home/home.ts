import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ThemeToggleComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}
