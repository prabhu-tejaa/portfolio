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
    },
    {
        path: "spotifyComponent",
        loadComponent: () =>
            import('./spotify/spotify.component').then((c) => c.SpotifyComponent),
        title: 'Spotify Component'
    },
    {
        path: "scenaryComponent",
        loadComponent: () =>
            import('./scenary-one/scenary-one.component').then((c) => c.ScenaryOneComponent),
        title: 'Scenary Component'
    }
];
