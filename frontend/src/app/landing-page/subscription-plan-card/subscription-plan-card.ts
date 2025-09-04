import { Component, Input } from '@angular/core';
import { ButtomOutlined } from '../../components/buttons/buttom-outlined/buttom-outlined';
import { Api } from '../../../utils/api/api';
import { AuthService } from '../../../services/auth/auth';
import { notyf } from '../../../utils/notyf.utils';
import { ActivatedRoute, Router } from '@angular/router';
import { SUBSCRIPTION_TYPE } from '../../../utils/enum';
import { FlashcardService } from '../../../services/flashcard/flashcard';

@Component({
  selector: 'app-subscription-plan-card',
  imports: [ButtomOutlined],
  providers: [Api, AuthService],
  templateUrl: './subscription-plan-card.html',
  styleUrl: './subscription-plan-card.css',
})
export class SubscriptionPlanCard {
  public temporary_flashcard_id: any = null;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  @Input() availablePlan!: {
    id: number;
    subscriptionType:SUBSCRIPTION_TYPE,
    title: string;
    description: string;
    price: number;
    features: string[];
  };

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private flashcardService: FlashcardService,) {}
  async ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const tempId = params.get('temporary_flashcard_id');
     this.temporary_flashcard_id=tempId
      console.log("temId",tempId)
    }
    )}
  onClickPaymentPage(availablePlan: any) {
    console.log("subscriptionType",availablePlan.subscriptionType)
    if(availablePlan.subscriptionType==='free'){
      this.flashcardService
      .generateFirstFlashCard({
        tempId: this.temporary_flashcard_id
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
        
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.message || 'Payment failed.';
        },
      });
    }
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
