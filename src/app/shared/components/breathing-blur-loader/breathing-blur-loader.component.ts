import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, stagger, AnimationPlaybackControls } from 'framer-motion/dom';

@Component({
  selector: 'app-breathing-blur-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breathing-blur-loader.component.html',
  styleUrls: ['./breathing-blur-loader.component.scss']
})
export class BreathingBlurLoaderComponent implements AfterViewInit, OnDestroy {
  private _text = '';
  chars: string[] = [];

  private animation?: AnimationPlaybackControls;
  private timeoutId?: any;
  private destroyed = false;

  @ViewChildren('charSpan') charElements!: QueryList<ElementRef>;

  /* -------- Input -------- */
  @Input() set text(value: string) {
    this._text = value || '';
    this.chars = this._text.split('');
    this.scheduleAnimation();
  }

  get text(): string {
    return this._text;
  }

  /* -------- Lifecycle -------- */
  ngAfterViewInit() {
    // We rely on the initial input or manually starting it here.
    // If the input was set before ViewInit, startAnimation would have failed due to missing elements.
    this.startAnimation();
  }

  ngOnDestroy() {
    this.destroyed = true;
    this.stopAnimation();
  }

  /* -------- Animation Control -------- */
  private scheduleAnimation() {
    if (this.destroyed) return;
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.startAnimation(), 100);
  }

  private stopAnimation() {
    if (this.animation) {
      try {
        this.animation.stop();
      } catch (e) {
        // Ignore errors during stop
      }
      this.animation = undefined;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  private startAnimation() {
    if (this.destroyed) return;

    // Always stop previous before starting new one
    this.stopAnimation();

    if (!this.charElements || this.charElements.length === 0) {
      // If elements aren't ready yet, they will be soon via AfterViewInit or next Change Detection
      return;
    }

    const elements = this.charElements.map(el => el.nativeElement);

    // Create a continuous breathing effect (pulses from 0.3 to 1.0)
    // Using Framer Motion's native repeat and stagger for high performance
    this.animation = animate(
      elements,
      {
        opacity: [0.3, 1, 0.3],
        filter: ['blur(4px)', 'blur(0px)', 'blur(4px)']
      },
      {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: stagger(0.08)
      }
    );
  }


  trackByIndex(index: number) {
    return index;
  }
}
