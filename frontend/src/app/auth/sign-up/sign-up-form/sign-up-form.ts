import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtomPrimary } from '../../../components/buttons/buttom-primary/buttom-primary';
import { ButtomLogoText } from '../../../components/buttons/buttom-logo-text/buttom-logo-text';
import { InputWithLabel } from '../../../components/inputs/input-with-label/input-with-label';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '../../../../utils/api/api';
import { FlashcardService } from '../../../../services/flashcard/flashcard';
import { notyf } from '../../../../utils/notyf.utils';

@Component({
  selector: 'app-sign-up-form',
  imports: [ReactiveFormsModule, ButtomPrimary, ButtomLogoText, InputWithLabel],
  providers: [Api, AuthService, FlashcardService],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.css',
})
export class SignUpForm {
  registerForm: FormGroup;
  temporary_flashcard_id?: string;
  isLoading:boolean=false
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(6)]],
      confirmPassword: ['', [Validators.required, Validators.min(6)]],
    });

    this.route.queryParams.subscribe((params) => {
      const tempId = params['temp_id'];
      if (tempId) {
        this.temporary_flashcard_id = tempId;
      } else {
        this.temporary_flashcard_id = undefined;
      }
    });
  }

  navigate(path : string){
    console.log("pat",path)
    this.router.navigate([path])
    }

  submit() {
    console.log('register submit called');
    if (this.registerForm.valid) {
    if (this.isLoading) return;
      this.isLoading=true
      const { name, email, password } = this.registerForm.value;
      const registerData: any = { name, email, password };
      if (this.temporary_flashcard_id) {
        registerData.temporary_flashcard_id = this.temporary_flashcard_id;
      }
     const registerRes =  this.authService.register(registerData).subscribe(
      {
          next: (res) => {
            this.isLoading=false
            notyf.success("SignUp successfuly")

          },
          error: (err) => {
                  console.log('err in register', err.message);
                  this.isLoading=false
                  notyf.error(err.message)
                  // Error is already handled in AuthService, but you can add more logic here if needed
                },
        })
    //  registerRes.subscribe({
    //     next: (res) => {
    //       console.log("resiget inside next=================")
    //       if (this.temporary_flashcard_id) {
    //         // this.flashcardService
    //         //   .generateFlashCard({
    //         //     workspace_id: res.data.workspace_id,
    //         //     temporary_flashcard_id: this.temporary_flashcard_id,
    //         //   })
    //         //   .subscribe({
    //         //     next: () => {
    //         //       this.router.navigate(['plans']);
    //         //     },
    //         //     error: () => {
    //         //       notyf.error('error generating flash card');
    //         //     },
    //         //   });
    //         this.router.navigate(['plans']);
    //       } else {
    //         this.router.navigate(['dashboard']);
    //       }
    //     },
    //     error: (err) => {
    //       console.log('err in register', err.message);
    //       // Error is already handled in AuthService, but you can add more logic here if needed
    //     },
    //   });
    } else {
      this.isLoading=false
      this.registerForm.markAllAsTouched();
    }
  }
}
