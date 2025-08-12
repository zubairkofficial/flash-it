import { Component } from '@angular/core';
import { InputWithLabel } from '../../inputs/input-with-label/input-with-label';
import { ButtomPrimary } from '../../buttons/buttom-primary/buttom-primary';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtomLogoText } from "../../buttons/buttom-logo-text/buttom-logo-text";

@Component({
  selector: 'app-signin-form',
  imports: [InputWithLabel, ButtomPrimary, ReactiveFormsModule, ButtomLogoText],
  templateUrl: './signin-form.html',
  styleUrl: './signin-form.css',
})
export class SigninForm {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
