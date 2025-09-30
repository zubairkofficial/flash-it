import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from './auth/auth';
import { SignedOutLayout } from './layout/signed-out-layout/signed-out-layout';
// import { FlashCardLayout } from './layout/flash-card-layout/flash-card-layout';
import { LandingPage } from './landing-page/landing-page';
import { PricePlanSection } from './landing-page/price-plan-section/price-plan-section';
import { Dashboard } from './pages/dashboard/dashboard';
import { WorkspaceDetail } from './pages/workspace-detail/workspace-detail';
import { FlashcardViewer } from './pages/flashcard-viewer/flashcard-viewer';
import { WorkspaceInvite } from './workspace-invite/workspace-invite';
import { PaymentCard } from './payment-card/payment-card';
import { Profile } from './pages/profile/profile';
import { ChangePassword } from './pages/change-password/change-password';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { GenerateFlashcardSection } from './landing-page/generate-flashcard-section/generate-flashcard-section';
import { Settings } from './settings/settings';
import { FlashcardDetailComponent } from './pages/flashcard-detail/flashcard-detail';
import { CommonLayoutComponent } from './common-layout/common-layout';

const isAuthenticated = (): boolean => !!localStorage.getItem('authToken');
export const authGuard: CanActivateFn = () => {
  if (isAuthenticated()) return true;
  const router = inject(Router);
  router.navigate(['auth/login']);
  return false;
};
export const guestGuard: CanActivateFn = () => !isAuthenticated();

export const routes: Routes = [
  //   {
  //     path: '',
  //     component: UserLayout,
  //     canActivate: [authGuard, userGuard],
  //     loadChildren: () => import('./user/user-module').then((m) => m.UserModule),
  //   },
  //   {
  //     path: 'admin',
  //     component: AdminLayout,
  //     canActivate: [authGuard, adminGuard],
  //     loadChildren: () =>
  //       import('./admin/admin-module').then((m) => m.AdminModule),
  //   },
  {
    path: 'auth',
    component: Auth,
    loadChildren: () => import('./auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: SignedOutLayout,
    children: [
      { path: '', component: LandingPage },
      { path: 'plans-register', component: PricePlanSection },
    ],
  },
  {
    path: '',
    component: CommonLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'uploaded-file', component: GenerateFlashcardSection },
      { path: 'workspace/:id', component: WorkspaceDetail },
      { path: 'workspace/invited/:id', component: WorkspaceInvite },
      { path: 'flashcard/:id', component: FlashcardViewer },
      { path: 'flashcard/:id/detail', component: FlashcardDetailComponent },
      { path: 'plans', component: PricePlanSection },
      { path: 'profile', component: Profile },
      { path: 'change-password', component: ChangePassword },
      { path: 'settings', component: Settings },
    ],
  },
  { path: 'payment/card', component: PaymentCard },

  { path: '**', component: NotFoundComponent },
];
