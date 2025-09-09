import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth';
import { InputWithLabel } from '../../components/inputs/input-with-label/input-with-label';
import { ButtomPrimary } from '../../components/buttons/buttom-primary/buttom-primary';
import { SignedInSidebar } from '../../shared/signed-in-sidebar/signed-in-sidebar';
import { notyf } from '../../../utils/notyf.utils';
import { SiteHeader } from '../../shared/site-header/site-header';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputWithLabel, ButtomPrimary,SignedInSidebar,SiteHeader],
  providers:[AuthService],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword {
  form: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.authService.changePassword(this.form.value).subscribe({
      next: ({ data }) => {
        notyf.success(data.message);
      },
      error: (err) => {
        console.log("err",err)
        // Handle different types of errors (you can customize based on backend error structure)
        const errorMessage = err?.error?.message || err?.message ||  'Something went wrong. Please try again.';
        notyf.error(errorMessage);
      }
    });
    
    
    
  }
}







