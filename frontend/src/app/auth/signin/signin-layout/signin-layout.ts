import { Component } from '@angular/core';
import { SigninForm } from "../signin-form/signin-form";
import { FlashCardSection } from "../../flash-card-section/flash-card-section";

@Component({
  selector: 'app-signin-layout',
  imports: [SigninForm, FlashCardSection],
  templateUrl: './signin-layout.html',
  styleUrl: './signin-layout.css'
})
export class SigninLayout {

}
