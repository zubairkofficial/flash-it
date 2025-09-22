import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core'; // 👈 Import OnInit
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UiService } from '../ui/ui.service';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css'
})
export class SiteHeader implements OnInit { // 👈 Implement OnInit
  @Input() credits: number | null = null;
  userData: { name?: string } | null = null; // 👈 Type safety

  constructor(public ui: UiService) {}

  ngOnInit(): void {
    const user = localStorage.getItem("userData");
    this.userData = user ? JSON.parse(user) : null;
  }

  toggleMenu(): void {
    this.ui.toggleMenu();
  }
}




