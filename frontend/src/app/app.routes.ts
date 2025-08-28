import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { SignedOutLayout } from './layout/signed-out-layout/signed-out-layout';
// import { FlashCardLayout } from './layout/flash-card-layout/flash-card-layout';
import { LandingPage } from './landing-page/landing-page';
import { PricePlanSection } from './landing-page/price-plan-section/price-plan-section';
import { Dashboard } from './pages/dashboard/dashboard';
import { WorkspaceDetail } from './pages/workspace-detail/workspace-detail';
import { FlashcardViewer } from './pages/flashcard-viewer/flashcard-viewer';
import { WorkspaceInvite } from './workspace-invite/workspace-invite';

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
    path: '',
    component: SignedOutLayout,
    children: [
      {
        path: '',
        component: LandingPage,
      },
    ],
  },
  // {
  //   path: '',
  //   component: FlashCardLayout,
  //   children: [
  //     {
  //       path: '/flash-card',
  //       component: LandingPage,
  //     },
  //   ],
  // },
  {
    path: 'auth',
    component: Auth,
    loadChildren: () => import('./auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: 'plans',
    component: PricePlanSection,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'workspace/:id',
    component: WorkspaceDetail,
  },
  {
    path: 'workspace/invited/:id',
    component: WorkspaceInvite,
  },
  {
    path: 'flashcard/:id',
    component: FlashcardViewer,
  },
];
