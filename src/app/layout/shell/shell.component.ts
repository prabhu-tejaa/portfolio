import { Component, ChangeDetectorRef, inject, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterModule, RouterOutlet, ChildrenOutletContexts, IsActiveMatchOptions } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobeComponent } from '../../experience/globe/globe.component';
import { GlobeEngineService } from '../../experience/globe/services/globe-engine.service';
import { SocialWorldService } from '../../pages/social/services/social-world.service';
import { filter, takeUntil } from 'rxjs/operators';
import { trigger, transition, style, query, animate, group } from '@angular/animations';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GlobeComponent,
    RouterOutlet
  ],
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
      ]),
      // Default transition for other pages
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 2
          })
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('600ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, transform: 'translateY(-10px)' }))
          ], { optional: true }),
          query(':enter', [
            animate('800ms 200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class ShellComponent implements OnInit, OnDestroy {
  isLoaded = false;
  showWipBadge = false;
  isHomeActive = false;
  progress = 0;

  // Loader State Flags
  private assetsLoaded = false;
  private globeReady = false;

  private destroy$ = new Subject<void>();

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

    this.globeEngine.loadingProgress$
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.progress = val;
        this.cdr.markForCheck();

        if (val >= 100) {
          this.assetsLoaded = true;
          this.checkLoaderState();
        }
      });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateActiveState();
      });
  }

  onGlobeReady() {
    this.globeReady = true;
    this.checkLoaderState();
  }

  private checkLoaderState() {
    if (this.assetsLoaded && this.globeReady) {
      setTimeout(() => {
        this.isLoaded = true;
        this.updateActiveState(); // Ensure state is correct once loaded
        this.cdr.markForCheck();
      }, 500);
    }
  }



  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  // Handled in subscription and checkLoaderState


  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}