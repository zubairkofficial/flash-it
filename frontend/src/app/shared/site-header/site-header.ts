import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UiService } from '../ui/ui.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [CommonModule, RouterLink,MatIconModule],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css'
})
export class SiteHeader {
  @Input() credits: number | null = null;
  constructor(public ui: UiService) {}

  toggleMenu(): void {
    this.ui.toggleMenu();
  }
}





