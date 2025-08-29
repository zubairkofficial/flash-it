import { Component, Input } from '@angular/core';
import { ButtomOutlined } from '../../components/buttons/buttom-outlined/buttom-outlined';
import { Api } from '../../../utils/api/api';
import { AuthService } from '../../../services/auth/auth';
import { notyf } from '../../../utils/notyf.utils';
import { Router } from '@angular/router';
import { SUBSCRIPTION_TYPE } from '../../../utils/enum';

@Component({
  selector: 'app-subscription-plan-card',
  imports: [ButtomOutlined],
  providers: [Api, AuthService],
  templateUrl: './subscription-plan-card.html',
  styleUrl: './subscription-plan-card.css',
})
export class SubscriptionPlanCard {
  @Input() availablePlan!: {
    id: number;
    subscriptionType:SUBSCRIPTION_TYPE,
    title: string;
    description: string;
    price: number;
    features: string[];
  };

  constructor(private authService: AuthService, private router: Router) {}

  onClickPaymentPage(availablePlan: any) {
    console.log("subscriptionType",availablePlan.subscriptionType)
    this.router.navigate(['/payment/card'], {
      queryParams: {
        subscriptionType:availablePlan.subscriptionType,
      },
    });
    // this.authService
    //   .updateUserPlan({
    //     subscribePlan:subscriptionType,
    //   })
    //   .subscribe({
    //     next: (res) => {
    //       this.router.navigate(['dashboard']);
    //     },
    //     error: () => {
    //       notyf.error('error subscribing the plan - try again');
    //     },
    //   });
  }
}
