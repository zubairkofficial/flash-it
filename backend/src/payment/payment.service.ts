import { Injectable } from '@nestjs/common';
import { CardPaymentDto, CreatePaymentDto } from './dto/payment.dto';
import Stripe from 'stripe';
import { AuthService } from 'src/auth/auth.service';
import WorkSpace from 'src/models/workspace.model';
import { SubscriptionPlan } from 'src/models/subscription-plan.model';
import User from 'src/models/user.model';
import { FlashcardService } from 'src/flashcard/flashcard.service';
import { Sequelize } from 'sequelize-typescript';
import { PlanService } from 'src/plan/plan.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor(
    private planSrvice: PlanService,
    private flashCardService: FlashcardService,
    private sequelize: Sequelize,
  ) {}
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
      const expiry = input.expiry.split('/');
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

  async cardPaymentCreate(input: CardPaymentDto, req: any) {
    console.log('PaymentService.cardPaymentCreate called with input:', input);
    try {
      await this.initializeStripe();
      // const transaction = await this.sequelize.transaction();

      // const user = await this.authService.getUserById(req.user.id);

      const paymentIntent = await this.createPaymentIntent(
        input.price * 100,
        'usd',
        input.token,
      );
      const theSubscriptionPlan = await SubscriptionPlan.findOne({
        where: { plan_type: input.subscriptionType },
      });

      const plainSubs = theSubscriptionPlan.get({ plain: true });
      console.log('theSubscriptionPlan', plainSubs);
      console.log('theSubscriptionPlan', plainSubs.id);

      console.log(
        'theSubscriptionPlan',
        theSubscriptionPlan.id || theSubscriptionPlan.dataValues.id,
      );
      const theUser = await User.findOne({
        where: {
          id: req.user.id,
        },
      });
      console.log('theUser', theUser.id);
      theUser.credits = theUser.credits + 1000;
      theUser.plan_id = plainSubs.id;
      // const workSpace = await WorkSpace.findOne({
      //   where: { admin_user_id: req.user.id },
      // });

      // if (input.tempId) {
      //   const payload = {
      //     tempId: input.tempId,
      //     subscriptionType: input.subscriptionType,
      //   };
      //   await this.planSrvice.createPlan(payload, req);
      //   // await this.flashCardService.generateFlashCard(
      //   //       {
      //   //         temporary_flashcard_id: input.tempId,
      //   //         workspace_id: workSpace.id,
      //   //       },
      //   //       {
      //   //         user: {
      //   //           id: req.user.id,
      //   //         },
      //   //       },
      //   //       null

      //   //     );
      // }
      await theUser.save();

      const afterUpdate = await User.findOne({
        where: {
          id: req.user.id,
        },
        plain: true,
      });

      console.log(
        'asdfsadsadsadfsadf',
        afterUpdate,
        'asdfsadf',
        theSubscriptionPlan,
      );
      return paymentIntent;
    } catch (error) {
      console.error('Error in cardPaymentCreate:', error);
      throw new Error('Payment failed: ' + error.message);
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    cardTokenId: string,
  ) {
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
