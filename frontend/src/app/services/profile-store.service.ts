import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth';

@Injectable({ providedIn: 'root' })
export class ProfileStoreService {
  private profileSubject = new BehaviorSubject<any>(null);
  public profile$: Observable<any> = this.profileSubject.asObservable();

  constructor(private authService: AuthService) {
    this.loadProfile();
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (res) => this.profileSubject.next(res),
      error: () => this.profileSubject.next(null),
    });
  }

  updateProfile(data: any) {
    this.profileSubject.next(data);
  }

  getProfileValue() {
    return this.profileSubject.value;
  }
}
