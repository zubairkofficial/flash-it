import { Component } from '@angular/core';
import { PricePlanSection } from "./price-plan-section/price-plan-section";
import { GenerateFlashcardSection } from "../generate-flashcard-section/generate-flashcard-section";

@Component({
  selector: 'app-landing-page',
  imports: [ PricePlanSection, GenerateFlashcardSection],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage {

}
