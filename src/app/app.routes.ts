import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        data: { animation: 'HomePage' }
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
        data: { animation: 'AboutPage' }
      },
      {
        path: 'work',
        loadComponent: () => import('./pages/work/work.component').then(m => m.WorkComponent),
        data: { animation: 'WorkPage' }
      },
      {
        path: 'social',
        loadComponent: () => import('./pages/social/social.component').then(m => m.SocialComponent),
        data: { animation: 'SocialPage' }
      }
    ]
  }
];