import { Component } from '@angular/core';

import { ButtonToggle } from "../../components/buttons/button-toggle/button-toggle";
import { ButtonPrimaryDropdown } from "../../components/buttons/button-primary-dropdown/button-primary-dropdown";
import { ButtomPrimary } from "../../components/buttons/buttom-primary/buttom-primary";

@Component({
  selector: 'app-generate-flashcard-section',
  imports: [ButtonToggle, ButtonPrimaryDropdown, ButtomPrimary],
  templateUrl: './generate-flashcard-section.html',
  styleUrl: './generate-flashcard-section.css'
})
export class GenerateFlashcardSection {
activeState = 'docs'
activeLanguage = 'en'
isLanguageDropDownOpen = false
}
