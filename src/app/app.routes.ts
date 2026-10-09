import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/transfers/pages/transfers-page/transfers-page').then(
        (module) => module.TransfersPage
      )
  },
  { path: '**', redirectTo: '' }
];
