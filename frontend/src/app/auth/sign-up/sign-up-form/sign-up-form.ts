import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtomPrimary } from "../../../components/buttons/buttom-primary/buttom-primary";
import { ButtomLogoText } from "../../../components/buttons/buttom-logo-text/buttom-logo-text";
import { InputWithLabel } from "../../../components/inputs/input-with-label/input-with-label";

@Component({
  selector: 'app-sign-up-form',
  imports: [ReactiveFormsModule, ButtomPrimary, ButtomLogoText, InputWithLabel],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.css',
})
export class SignUpForm {
  registerForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(6)]],
      confirmPassword: ['', [Validators.required, Validators.min(6)]],
    });
  }
  submit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
