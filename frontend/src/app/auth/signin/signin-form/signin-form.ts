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

@Component({
  selector: 'app-signin-form',
  imports: [InputWithLabel, ButtomPrimary, ReactiveFormsModule, ButtomLogoText],
  providers: [Api, AuthService],
  templateUrl: './signin-form.html',
  styleUrl: './signin-form.css',
})
export class SigninForm {
  form: FormGroup;

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
      this.authService.login({ email: username, password }).subscribe({
        next: (response) => {
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
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
