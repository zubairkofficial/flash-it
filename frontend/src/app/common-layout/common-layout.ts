import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from '../shared/site-header/site-header';
import { SignedInSidebar } from '../shared/signed-in-sidebar/signed-in-sidebar';
import { ProfileStoreService } from '../services/profile-store.service';

@Component({
  selector: 'app-common-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SiteHeader, SignedInSidebar],
  templateUrl: './common-layout.html',
  styleUrls: ['./common-layout.css'],
})
export class CommonLayoutComponent implements OnInit {
  credits = 0;

  constructor(private profileStore: ProfileStoreService) {}

  ngOnInit() {
    this.profileStore.profile$.subscribe((profile) => {
      this.credits = profile?.credits ?? 0;
    });
  }
}
