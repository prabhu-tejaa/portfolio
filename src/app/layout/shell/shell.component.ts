import { Component, ChangeDetectorRef, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, RouterModule, RouterOutlet, ChildrenOutletContexts, IsActiveMatchOptions } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobeComponent } from '../../experience/globe/globe.component';
import { GlobeEngineService } from '../../experience/globe/services/globe-engine.service';
import { SocialWorldService } from '../../pages/social/services/social-world.service';
import { filter } from 'rxjs/operators';
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
          query(':leave', [
            animate('0ms', style({ opacity: 0, display: 'none' }))
          ], { optional: true }),

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
  showWipBadge = false;
  isHomeActive = false;
  loaderName = 'PRABHU TEJA PAMULA';

  private router = inject(Router);
  private globeEngine = inject(GlobeEngineService);
  private socialWorld = inject(SocialWorldService);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private contexts: ChildrenOutletContexts,
  ) { }

  ngOnInit() {
    this.socialWorld.preloadTextures();
    this.updateActiveState();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveState();
      });
  }

  private updateActiveState() {
    const url = this.router.url;
    this.showWipBadge = url.includes('/work') || url.includes('/about');

    const matchOptions: IsActiveMatchOptions = {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    };
    this.isHomeActive = this.router.isActive('/', matchOptions);

    this.globeEngine.transitionTo(url);
    this.cdr.markForCheck();
  }

  onGlobeReady() {
    if (this.isLoaded) return;

    // Settling delay to ensure heavy GPU tasks are finished before UI animations start
    setTimeout(() => {
      this.isLoaded = true;
      this.globeEngine.transitionTo(this.router.url);
      this.cdr.markForCheck();
    }, 600);
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}