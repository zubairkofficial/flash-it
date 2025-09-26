import { Component } from '@angular/core';
import { FlashCardSection } from "../../flash-card-section/flash-card-section";
import { SignUpForm } from "../sign-up-form/sign-up-form";

@Component({
  selector: 'app-sign-up-layout',
  imports: [FlashCardSection, SignUpForm],
  templateUrl: './sign-up-layout.html',
  styleUrl: './sign-up-layout.css'
})
export class SignUpLayout {

}
