import { Component, Input } from '@angular/core';
import { ButtomOutlined } from '../../components/buttons/buttom-outlined/buttom-outlined';
import { Api } from '../../../utils/api/api';
import { AuthService } from '../../../services/auth/auth';
import { notyf } from '../../../utils/notyf.utils';
import { ActivatedRoute, Router } from '@angular/router';
import { SUBSCRIPTION_TYPE } from '../../../utils/enum';
import { FlashcardService } from '../../../services/flashcard/flashcard';
import { PlanService } from '../../../services/plan/plan';

@Component({
  selector: 'app-subscription-plan-card',
  imports: [ButtomOutlined],
  providers: [Api, AuthService, FlashcardService, PlanService],
  templateUrl: './subscription-plan-card.html',
  styleUrl: './subscription-plan-card.css',
})
export class SubscriptionPlanCard {
  public temporary_flashcard_id: any = null;
  public flashcard_id: any = null;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  @Input() availablePlan!: {
    id: number;
    subscriptionType: SUBSCRIPTION_TYPE;
    title: string;
    description: string;
    price: number;
    features: string[];
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private flashcardService: FlashcardService,
    private planService: PlanService
  ) {}
  async ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const tempId = params.get('temp_id');
      const flashcardId = params.get('flashcard_id');
      this.temporary_flashcard_id = tempId;
      this.flashcard_id = flashcardId;
      console.log('temId', tempId, 'flashcardId', flashcardId);
    });
  }

  onClickPaymentPage(availablePlan: any) {
    if (availablePlan.subscriptionType === 'free') {
      this.isLoading = true;
      this.planService
        .creatPlan({
          tempId: this.temporary_flashcard_id,
          subscriptionType: availablePlan.subscriptionType,
        })
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            localStorage.setItem('tempId', this.temporary_flashcard_id);
            notyf.success('enjoy free plan');
            console.log('moving to upload files free', this.flashcard_id);
            this.router.navigate([`/uploaded-file`], {
              queryParams: {
                workspaceId: res.data.workspaceId,
                flashcard_id: this.flashcard_id,
                temp_id: this.temporary_flashcard_id,
                show: true,
              },
            });
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err?.error?.message || 'Payment failed.';
          },
        });
    } else {
      this.temporary_flashcard_id &&
        localStorage.setItem('tempId', this.temporary_flashcard_id);
      console.log('moving to payment', this.flashcard_id);

      this.router.navigate(['/payment/card'], {
        queryParams: {
          subscriptionType: availablePlan.subscriptionType,
          temp_id: this.temporary_flashcard_id,
          flashcard_id: this.flashcard_id,
          show: true,
        },
      });
    }
  }
}
