import { Component } from '@angular/core';
import { SiteHeader } from '../shared/site-header/site-header';
import { AuthRoutingModule } from '../auth/auth.routes';
import { ProfileStoreService } from '../services/profile-store.service';
import { UiService } from '../shared/ui/ui.service';

@Component({
  selector: 'app-flashcard-show-layout',
  imports: [SiteHeader, AuthRoutingModule],
  providers: [ProfileStoreService],
  templateUrl: './flashcard-show-layout.html',
  styleUrl: './flashcard-show-layout.css',
})
export class FlashcardShowLayout {
  credits = 0;
  userData: { name?: string } | null = null;

  constructor(
    private profileStore: ProfileStoreService,
    public ui: UiService
  ) {}

  ngOnInit() {
    this.profileStore.profile$.subscribe((profile) => {
      this.credits = profile?.credits ?? 0;
    });

    const user = localStorage.getItem('userData');
    const parsedUser = user ? JSON.parse(user) : null;
    this.userData = parsedUser?.dataValues ?? parsedUser;
  }

  toggleMenu(): void {
    this.ui.toggleMenu();
  }
}
