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
  providers: [Api, AuthService, FlashcardService,PlanService],
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

  constructor( private router: Router, private route: ActivatedRoute, private flashcardService: FlashcardService,private planService:PlanService) {}
  async ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const tempId = params.get('temporary_flashcard_id');
     this.temporary_flashcard_id=tempId
      console.log("temId",tempId)
    }
    )}

  onClickPaymentPage(availablePlan: any) {
   
    if(availablePlan.subscriptionType==='free'){
      this.isLoading=true
      this.planService.creatPlan({tempId: this.temporary_flashcard_id,subscriptionType:availablePlan.subscriptionType}).subscribe({
          next: (res) => {
            console.log("res======================",res)
            this.isLoading = false;
            notyf.success('enjoy free plan')
            this.router.navigate([`/uploaded-file?workspace=${res.data.workspaceId}`]);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err?.error?.message || 'Payment failed.';
          },
        });
      
    }
    else{
      this.router.navigate(['/payment/card'], {
      queryParams: {
        subscriptionType:availablePlan.subscriptionType,
        tempId:this.temporary_flashcard_id
      },
    });}

  }
}
