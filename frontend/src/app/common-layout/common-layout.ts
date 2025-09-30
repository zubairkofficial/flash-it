import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from '../shared/site-header/site-header';
import { SignedInSidebar } from '../shared/signed-in-sidebar/signed-in-sidebar';

@Component({
  selector: 'app-common-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SiteHeader,
    SignedInSidebar,
  ],
  templateUrl: './common-layout.html',
  styleUrls: ['./common-layout.css'],
})
export class CommonLayoutComponent {
  credits = 0; // or load this dynamically later
}
