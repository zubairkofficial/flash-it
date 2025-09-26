import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';
import { PaymentService } from '../../services/payment/payment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PricePlanSection } from '../landing-page/price-plan-section/price-plan-section';
import { notyf } from '../../utils/notyf.utils';

@Component({
  selector: 'app-payment-card',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './payment-card.html',
  styleUrl: './payment-card.css',
})
export class PaymentCard implements OnInit {
  public stripe!: Stripe | null;
  public cardNumber!: StripeCardNumberElement;
  public cardExpiry!: StripeCardExpiryElement;
  public cardCvc!: StripeCardCvcElement;

  public cardHolderName: string = '';
  public isLoading = false;
  public errorMessage: string | null = null;
  public subscriptionType: any = null;
  public selectedPlan: any = null;
  public amount: any = null;
  public tempId = '';

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51Riao5FYp7fvEyJ724EWSCy2EqzU2YENGevK2zhJFVm3vN1SVatdw9uu3l1EQQojpJZFieTsIU8PY3eYihZEa7VR00Ng5ogJpP');

    const elements = this.stripe?.elements();
    if (!elements) return;

    // Read query params
    this.route.queryParamMap.subscribe((params) => {
      const type = params.get('subscriptionType');
      this.tempId = params.get('tempId') ?? '';
      if (type === 'free') {
        this.router.navigate(['dashboard']);
      }
      this.subscriptionType = type;
    });

    // Match price plan
    const matchedPlan = new PricePlanSection().plans.find(
      (plan) => plan.subscriptionType === this.subscriptionType
    );
    this.selectedPlan = matchedPlan;
    this.amount = matchedPlan?.price;

    // Create individual elements
    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount('#card-number');

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount('#card-expiry');

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount('#card-cvc');
  }

  async onSubmit() {
    this.isLoading = true;
    this.errorMessage = null;

    const { token, error } = await this.stripe!.createToken(this.cardNumber, {
      name: this.cardHolderName,
    });

    if (error) {
      this.errorMessage = error.message || 'Card error.';
      this.isLoading = false;
      return;
    }

    console.log('Token received:', token);

    this.paymentService
      .createCardPayment({
        token: token.id,
        subscriptionType: this.subscriptionType,
        price: this.amount,
        tempId: this.tempId,
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          notyf.success('Payment successful');
          if (this.tempId) {
            this.router.navigate([`/uploaded-file`]);
          } else {
            this.router.navigate(['dashboard']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.message || 'Payment failed.';
          notyf.error(`${this.errorMessage}`);
        },
      });
  }
}
