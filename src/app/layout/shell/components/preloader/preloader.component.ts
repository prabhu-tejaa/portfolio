import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreathingBlurLoaderComponent } from '../../../../shared/components/breathing-blur-loader/breathing-blur-loader.component';

@Component({
    selector: 'app-preloader',
    standalone: true,
    imports: [CommonModule, BreathingBlurLoaderComponent],
    template: `
    <div class="preloader" [class.hidden]="isLoaded" [attr.aria-hidden]="isLoaded">
      <app-breathing-blur-loader [text]="text"></app-breathing-blur-loader>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }

    .preloader {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      background-color: #050505;
      opacity: 1;
      visibility: visible;
      transition: 
        opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
        visibility 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      
      will-change: opacity, visibility;
      pointer-events: auto;

      &.hidden {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
      }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreloaderComponent {
    @Input() isLoaded = false;
    @Input() text = 'PRABHU TEJA';
}
