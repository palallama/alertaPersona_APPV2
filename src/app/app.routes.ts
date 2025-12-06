import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./views/home/home/home.page').then( m => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./views/profile/profile.page').then( m => m.ProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'history',
    loadComponent: () => import('./views/history/history.page').then( m => m.HistoryPage),
    canActivate: [authGuard]
  },
  {
    path: 'emit-alert',
    loadComponent: () => import('./views/alert/emit-alert/emit-alert.page').then( m => m.EmitAlertPage),
    canActivate: [authGuard]
  },
  {
    path: 'assist-alert',
    loadComponent: () => import('./views/alert/assist-alert/assist-alert.page').then( m => m.AssistAlertPage),
    canActivate: [authGuard]
  },
  {
    path: 'assist-alert/:id',
    loadComponent: () => import('./views/alert/assist-alert/assist-alert.page').then( m => m.AssistAlertPage),
    canActivate: [authGuard]
  },
  {
    path: 'contacts',
    loadComponent: () => import('./views/contact/contacts/contacts.page').then( m => m.ContactsPage),
    canActivate: [authGuard]
  },
  {
    path: 'add-contact',
    loadComponent: () => import('./views/contact/add-contact/add-contact.page').then( m => m.AddContactPage),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./views/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'sing-in',
    loadComponent: () => import('./views/auth/sing-in/sing-in.page').then( m => m.SingInPage)
  },
  {
    path: 'fp-mail',
    loadComponent: () => import('./views/auth/forgot-password/fp-mail/fp-mail.page').then( m => m.FpMailPage)
  },
  {
    path: 'fp-code',
    loadComponent: () => import('./views/auth/forgot-password/fp-code/fp-code.page').then( m => m.FpCodePage)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./views/auth/change-password/change-password.page').then( m => m.ChangePasswordPage)
  },
  {
    path: 'invitacion/:codigo',
    loadComponent: () => import('./views/invitacion/verificar-invitacion/verificar-invitacion.page').then( m => m.VerificarInvitacionPage)
  },
  {
    path: 'verificar-invitacion/:codigo',
    loadComponent: () => import('./views/invitacion/verificar-invitacion/verificar-invitacion.page').then( m => m.VerificarInvitacionPage)
  },
];
