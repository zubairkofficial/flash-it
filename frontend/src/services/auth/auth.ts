import { Injectable } from '@angular/core';
import { Api } from '../../utils/api/api';
import { Observable } from 'rxjs';
import { notyf } from '../../utils/notyf.utils';
import { Router } from '@angular/router';
import { SUBSCRIPTION_TYPE } from '../../utils/enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private api: Api, private router: Router) {}

  register(userData: {
    name: string;
    email: string;
    password: string;
    temporary_flashcard_id?: string;
  }): Observable<any> {
    console.log('register called---------');
    const res = this.api.post('/auth/register', userData, {});
    res.subscribe({
      next: (response: any) => {
        console.log('inside auth next register');
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));

        if (userData.temporary_flashcard_id) {
          // this.flashcardService
          //   .generateFlashCard({
          //     workspace_id: res.data.workspace_id,
          //     temporary_flashcard_id: this.temporary_flashcard_id,
          //   })
          //   .subscribe({
          //     next: () => {
          //       this.router.navigate(['plans']);
          //     },
          //     error: () => {
          //       notyf.error('error generating flash card');
          //     },
          //   });
          this.router.navigate(['plans']);
        } else {
          this.router.navigate(['dashboard']);
        }
      },
      error: (err) => {
        notyf.error(err?.error?.message || err.message || 'Login failed.');
      },
    });

    return res;
  }

  login(credentials: {
    email: string;
    password: string;
    temporary_flashcard_id?: string;
  }): Observable<any> {
    const res = this.api.post('/auth/login', credentials, {});
    res.subscribe({
      next: (response: any) => {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      },
      error: (err) => {
        notyf.error(err?.error?.message || err.message || 'Login failed.');
      },
    });

    return res;
  }

  updateUserPlan(data: { subscriptionType: SUBSCRIPTION_TYPE }): Observable<any> {
    return this.api.put('/auth/update-user-plan', data, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }
}
