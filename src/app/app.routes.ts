import { Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';

export const routes: Routes = [
    { path: '', component: PortfolioComponent },
    {
        path: "navigationMenu",
        loadComponent: () =>
            import('./navigation-menu/navigation-menu.component').then((c) => c.NavigationMenuComponent),
        title: 'Navigation Menu'
    },
    {
        path: "visualizerComponent",
        loadComponent: () =>
            import('./visualizer/visualizer.component').then((c) => c.VisualizerComponent),
        title: 'Visualizer Component'
    }
];
