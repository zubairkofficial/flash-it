import { Component } from '@angular/core';
import { SigninForm } from "../signin-form/signin-form";
import { FlashCardSection } from "../../flash-card-section/flash-card-section";
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin-layout',
  imports: [SigninForm, FlashCardSection],
  templateUrl: './signin-layout.html',
  styleUrl: './signin-layout.css'
})
export class SigninLayout {
 constructor(private router: Router) {}
  navigate(path: string) {
    this.router.navigate([path]);
  }
}
