import { Component } from '@angular/core';
import { ButtomPrimary } from '../../components/buttons/buttom-primary/buttom-primary';
import { ButtomOutlined } from '../../components/buttons/buttom-outlined/buttom-outlined';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signed-out-header',
  imports: [ButtomPrimary, ButtomOutlined],
  templateUrl: './signed-out-header.html',
  styleUrl: './signed-out-header.css',
})
export class SignedOutHeader {
  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
