import { Injectable } from '@angular/core';
import { Api } from '../../utils/api/api';
import { DATA_TYPE, SUBSCRIPTION_TYPE } from '../../utils/enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private api: Api) {}

  createCardPayment(token: { token: string;subscriptionType: any,price:number }): Observable<any> {
    return this.api.post('/payment/', {...token}, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }

}
