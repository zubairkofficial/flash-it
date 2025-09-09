import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth';
import { InputWithLabel } from '../../components/inputs/input-with-label/input-with-label';
import { ButtomPrimary } from '../../components/buttons/buttom-primary/buttom-primary';
import { SignedInSidebar } from '../../shared/signed-in-sidebar/signed-in-sidebar';
import { notyf } from '../../../utils/notyf.utils';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputWithLabel, ButtomPrimary,SignedInSidebar],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.form = this.fb.group({
      name: [userData?.name || '', [Validators.required]],
      email: [{ value: userData?.email || '', disabled: true }, [Validators.required, Validators.email]],
      avatar_url: [userData?.avatar_url || ''],
    });
  }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(( data ) => {
      console.log("user???",data)
      const user = data?.user || data;
      if (user) {
        this.form.patchValue({
          name: user.name || '',
          email: user.email || '', 
          avatar_url: user.avatar_url || '',
        });
        localStorage.setItem('userData', JSON.stringify(user));
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.authService.updateProfile(this.form.value).subscribe(({ data }) => {
      if (data?.user) {
        notyf.success(data.message)
        localStorage.setItem('userData', JSON.stringify(data.user));
      }
    });
  }
}







