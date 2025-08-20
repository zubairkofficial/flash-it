import { Injectable } from '@angular/core';
import { Api } from '../../utils/api/api';
import { Observable } from 'rxjs';
import { notyf } from '../../utils/notyf.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private api: Api) {}

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
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
      },
      error: (err) => {
        notyf.error(err?.error?.message || err.message || 'Login failed.');
      },
    });

    return res;
  }
}
