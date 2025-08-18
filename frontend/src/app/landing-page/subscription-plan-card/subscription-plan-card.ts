import { Component, Input } from '@angular/core';
import { ButtomOutlined } from "../../components/buttons/buttom-outlined/buttom-outlined";

@Component({
  selector: 'app-subscription-plan-card',
  imports: [ButtomOutlined],
  templateUrl: './subscription-plan-card.html',
  styleUrl: './subscription-plan-card.css',
})
export class SubscriptionPlanCard {
  @Input() availablePlan!: {
    title: string;
    description: string;
    price: number;
    features: string[];
  };
}
