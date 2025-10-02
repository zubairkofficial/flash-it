import { Component } from '@angular/core';
import { SiteHeader } from '../shared/site-header/site-header';
import { AuthRoutingModule } from '../auth/auth.routes';
import { ProfileStoreService } from '../services/profile-store.service';

@Component({
  selector: 'app-flashcard-show-layout',
  imports: [SiteHeader, AuthRoutingModule],
  providers: [ProfileStoreService],
  templateUrl: './flashcard-show-layout.html',
  styleUrl: './flashcard-show-layout.css',
})
export class FlashcardShowLayout {
  credits = 0;

  constructor(private profileStore: ProfileStoreService) {}

  ngOnInit() {
    this.profileStore.profile$.subscribe((profile) => {
      this.credits = profile?.credits ?? 0;
    });
  }
}
