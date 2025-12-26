import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { WorkComponent } from './pages/work/work.component';
import { SocialComponent } from './pages/social/social.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      // 👇 Add "data: { animation: 'Name' }" to each child
      { 
        path: '', 
        component: HomeComponent, 
        data: { animation: 'HomePage' } 
      },
      { 
        path: 'about', 
        component: AboutComponent, 
        data: { animation: 'AboutPage' } // 👈 Vital for the exit animation
      },
      { 
        path: 'work', 
        component: WorkComponent, 
        data: { animation: 'WorkPage' } 
      },
      { 
        path: 'social', 
        component: SocialComponent, 
        data: { animation: 'SocialPage' } 
      }
    ]
  }
];