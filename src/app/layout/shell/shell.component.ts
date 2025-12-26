import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, RouterModule, RouterOutlet, ChildrenOutletContexts } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobeComponent } from '../../experience/globe/globe.component';
import { GlobeEngineService } from '../../experience/globe/services/globe-engine.service';
import { filter } from 'rxjs/operators';
// Added 'group' to the imports here
import { trigger, transition, style, query, animate, group } from '@angular/animations';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, GlobeComponent, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('routeAnimations', [
      transition('* => SocialPage', [
        style({ position: 'relative' }),

        // 1. Layer both pages.
        // We force the leaving page to disappear IMMEDIATELY.
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          })
        ], { optional: true }),

        group([
          // 2. INSTANT EXIT: 
          // We set duration to 0ms so the old page is gone the moment you click.
          query(':leave', [
            animate('0ms', style({ opacity: 0, display: 'none' }))
          ], { optional: true }),

          // 3. SLOW ENTRY:
          // The new page fades in elegantly over 1.2s.
          query(':enter', [
            style({ opacity: 0, zIndex: 2 }),
            animate('1200ms ease-in-out', style({ opacity: 1 }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class ShellComponent implements OnInit {
  isLoaded = false;
  loaderName = 'PRABHU TEJA PAMULA';

  constructor(
    private router: Router,
    private globeEngine: GlobeEngineService,
    private contexts: ChildrenOutletContexts
  ) { }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.globeEngine.transitionTo(this.router.url);
      });
  }

  onGlobeReady() {
    if (this.isLoaded) return;
    this.isLoaded = true;
    this.globeEngine.transitionTo(this.router.url);
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}