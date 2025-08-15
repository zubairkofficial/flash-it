import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth.routes';
import { SignUpLayout } from './sign-up/sign-up-layout/sign-up-layout';
import { SigninLayout } from './signin/signin-layout/signin-layout';

@NgModule({
  declarations: [],
  imports: [CommonModule, AuthRoutingModule, SignUpLayout, SigninLayout],
})
export class AuthModule {}
