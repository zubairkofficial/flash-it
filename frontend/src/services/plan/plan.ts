import { Injectable } from '@angular/core';
import { Api } from '../../utils/api/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor(private api: Api) {}

  creatPlan(data: { tempId: any; subscriptionType: any; }): Observable<any> {
    return this.api.post('/plan/', data, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }
}
