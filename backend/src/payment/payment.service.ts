import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/payment.dto';
import Stripe from 'stripe';
import { AuthService } from 'src/auth/auth.service';
import WorkSpace from 'src/models/workspace.model';
import { SubscriptionPlan } from 'src/models/subscription-plan.model';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
constructor(private authService: AuthService,){}
  private async initializeStripe(): Promise<void> {
    if (!this.stripe) {
      const stripeApiKey = process.env.STRIPE_KEY; // Fetch API key from DB
      this.stripe = new Stripe(stripeApiKey, {
        apiVersion: '2025-08-27.basil', // Use the latest API version
      });
    }
  }

  async createCardToken(input: CreatePaymentDto) {
    try {
     const expiry= input.expiry.split("/")
      const cardToken = await this.stripe.tokens.create({
        card: {
          number: input.cardNumber,
          exp_month: parseInt(expiry[0]),
          exp_year: parseInt(expiry[1]),
          cvc: input.cvv,
        },
      } as any);
      return cardToken;
    } catch (error) {
      console.error('Error creating card token:', error);
      throw new Error('Card token creation failed');
    }
  }

  async cardPaymentCreate(input: { price: number; token: string; subscriptionType: any; }, req: any) {
    await this.initializeStripe();
  
    // const user = await this.authService.getUserById(req.user.id);
  
    const paymentIntent = await this.createPaymentIntent(
      input.price*100, 
      'usd',
      input.token 
    );
    // const subscriptionPlan=await SubscriptionPlan.findOne({where:{plan_type:input.subscriptionType}})
    const workSpace=await WorkSpace.findOne({where:{admin_user_id:req.user.id}})
    workSpace.credit=+workSpace.credit+1000
    await workSpace.save()
    return paymentIntent;
  }
  

  async createPaymentIntent(amount: number, currency: string, cardTokenId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount, // Amount in cents
        currency,
        payment_method_data: {
          type: 'card',
          card: {
            token: cardTokenId,
          },
        },
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      } as any);
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Payment intent creation failed');
    }
  }

 
}
