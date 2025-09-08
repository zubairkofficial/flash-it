import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth';
import { InputWithLabel } from '../../components/inputs/input-with-label/input-with-label';
import { ButtomPrimary } from '../../components/buttons/buttom-primary/buttom-primary';
import { SignedInSidebar } from '../../shared/signed-in-sidebar/signed-in-sidebar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputWithLabel, ButtomPrimary,SignedInSidebar],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  form: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.form = this.fb.group({
      name: [userData?.name || '', [Validators.required]],
      email: [userData?.email || '', [Validators.required, Validators.email]],
      avatar_url: [userData?.avatar_url || ''],
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.authService.updateProfile(this.form.value).subscribe(({ data }) => {
      if (data?.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
      }
    });
  }
}





