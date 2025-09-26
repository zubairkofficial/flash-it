import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth';
import { InputWithLabel } from '../../../components/inputs/input-with-label/input-with-label';
import { ButtomPrimary } from '../../../components/buttons/buttom-primary/buttom-primary';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtomLogoText } from '../../../components/buttons/buttom-logo-text/buttom-logo-text';
import { Router } from '@angular/router';
import { Api } from '../../../../utils/api/api';
import { notyf } from '../../../../utils/notyf.utils';

@Component({
  selector: 'app-signin-form',
  imports: [InputWithLabel, ButtomPrimary, ReactiveFormsModule, ButtomLogoText],
  providers: [Api, AuthService],
  templateUrl: './signin-form.html',
  styleUrl: './signin-form.css',
})
export class SigninForm {
  form: FormGroup;
  isLoading:boolean=false
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.valid) {
      const { username, password } = this.form.value;
      this.isLoading=true
      this.authService.login({ email: username, password }).subscribe({
        next: (response) => {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('userData', JSON.stringify(response.data.user));  
          this.isLoading=false
          notyf.success("Login successfully")
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          notyf.error(err?.error?.message || err.message || 'Login failed.');
    
          this.isLoading=false
          // Error is already handled in AuthService, but you can add more logic here if needed
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  navigate(path : string){
    console.log("pat",path)
    this.router.navigate([path])
    }
}
