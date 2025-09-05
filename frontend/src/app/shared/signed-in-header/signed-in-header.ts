import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-signed-in-header',
  imports: [RouterLink],
  templateUrl: './signed-in-header.html',
  styleUrl: './signed-in-header.css'
})
export class SignedInHeader {
  constructor(private authService: AuthService,private router:Router) {}

  logout() {
    this.authService.logout();
  }
  profile() {
    this.router.navigate(['profile']);
  }
}
