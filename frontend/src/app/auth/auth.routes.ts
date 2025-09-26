import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninLayout } from './signin/signin-layout/signin-layout';
import { SignUpLayout } from './sign-up/sign-up-layout/sign-up-layout';

export const routes: Routes = [
  {
    path: 'login',
    component: SigninLayout,
  },

  {
    path: 'register',
    component: SignUpLayout,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
