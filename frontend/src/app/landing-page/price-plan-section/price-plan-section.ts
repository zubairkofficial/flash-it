import { Component } from '@angular/core';
import { SubscriptionPlanCard } from '../subscription-plan-card/subscription-plan-card';
import { SUBSCRIPTION_TYPE } from '../../../../../backend/src/utils/subscription.enum';

@Component({
  selector: 'app-price-plan-section',
  imports: [SubscriptionPlanCard],
  templateUrl: './price-plan-section.html',
  styleUrl: './price-plan-section.css',
})
export class PricePlanSection {
  plans = [
    {
      id: 1,
      title: 'Free Plan',
      subscriptionType: SUBSCRIPTION_TYPE.FREE,
      description: 'Up to 5 Flashcards',
      price: 0,
      features: [
        'Flashcard Generation 5',
        '1 Credit = 1 Flashcard',
        'One-time use',
        'Answer Levels - Concise only',
        'Language Options English only',
        'Export PDF only',
        'History Log Access - Last 5 sets only',
        'Flashcard Storage 20 max',
      ],
    },
    {
      id: 2,
      title: 'Pro Plan',
      subscriptionType: SUBSCRIPTION_TYPE.PRO,
      description: 'Up to 30 Flashcards',
      price: 5,
      features: [
        'Flashcard Generation 30',
        '1 Credit = 1 Flashcard',
        'No-expiry',
        'Answer Levels - Concise, Standard, Detailed',
        'STEM/LaTeX Support',
        'Language Options All supported languages',
        'Export PDF, PowerPoint, JSON',
        'Flashcard Sharing',
        'History Log Access - Full history',
        'Flashcard Storage 200 max',
        'Custom Flashcard',
      ],
    },
    {
      id: 3,
      title: 'Team Plan',
      description: 'Up to 100 Flashcards',
      subscriptionType: SUBSCRIPTION_TYPE.TEAM,
      price: 15,
      features: [
        'Flashcard Generation 100',
        '1 Credit = 1 Flashcard',
        'No-expiry',
        'Answer Levels - Concise, Standard, Detailed',
        'Language Options All supported languages',
        'Export PDF, PowerPoint, JSON',
        'History Log Access - Full history',
        'Flashcard Storage 1,000+ (shared)',
        'STEM/LaTeX Support',
        'Flashcard Sharing',
        'Custom Flashcard',
      ],
    },
  ];
}
