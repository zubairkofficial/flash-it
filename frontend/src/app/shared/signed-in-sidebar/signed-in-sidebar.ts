import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-signed-in-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './signed-in-sidebar.html',
  styleUrl: './signed-in-sidebar.css'
})
export class SignedInSidebar {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}



