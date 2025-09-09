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
    return this.api.post('/auth/register', userData, {});
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

  updateUserPlan(data: { subscribePlan: SUBSCRIPTION_TYPE }): Observable<any> {
    return this.api.put('/auth/update-user-plan', data, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.router.navigate(['auth/login']);
  }

  updateProfile(data: { name?: string; email?: string; avatar_url?: string }): Observable<any> {
    return this.api.put('/auth/update-profile', data, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }

  getProfile(): Observable<any> {
    return this.api.get('/auth/profile', {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.api.put('/auth/change-password', data, {
      ...this.api.contentTypeHeader,
      ...this.api.authorizationHeader,
    });
  }
}
