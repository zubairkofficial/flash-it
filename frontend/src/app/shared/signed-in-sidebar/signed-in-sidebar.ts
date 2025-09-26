import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { UiService } from '../ui/ui.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signed-in-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule,MatIconModule],
  templateUrl: './signed-in-sidebar.html',
  styleUrl: './signed-in-sidebar.css'
})
export class SignedInSidebar {
  currentPath: string = '';
  constructor(private authService: AuthService,private route: ActivatedRoute, public ui: UiService) {}
  ngOnInit() {
    this.route.url.subscribe(segments => {
      this.currentPath = segments.map(segment => segment.path).join('/');
    });
  }
  logout() {
    this.authService.logout();
  }
}



