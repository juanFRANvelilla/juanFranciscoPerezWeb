import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-debtapp',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './debtapp.html',
  styleUrl: './debtapp.css'
})
export class Debtapp {
  activeTab: 'info' | 'test' = 'info';

  setActiveTab(tab: 'info' | 'test') {
    this.activeTab = tab;
  }
}
