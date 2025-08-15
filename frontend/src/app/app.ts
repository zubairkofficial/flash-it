import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SigninLayout } from "./auth/signin/signin-layout/signin-layout";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, SigninLayout],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'frontend';
}
