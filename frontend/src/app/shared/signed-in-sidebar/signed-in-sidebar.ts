import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-signed-in-sidebar',
  standalone: true,
  imports: [RouterLink,RouterModule ],
  templateUrl: './signed-in-sidebar.html',
  styleUrl: './signed-in-sidebar.css'
})
export class SignedInSidebar {
  currentPath: string = '';
  isMenuOpen: boolean = false;
  constructor(private authService: AuthService,private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.url.subscribe(segments => {
      this.currentPath = segments.map(segment => segment.path).join('/');
    });
  }
  logout() {
    this.authService.logout();
  }
}



