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
    this.startAnimation();
  }

  ngOnDestroy() {
    this.destroyed = true;

    if (this.animation) {
      this.animation.stop();
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  /* -------- Animation Control -------- */
  private scheduleAnimation() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.startAnimation(), 50);
  }

  private async startAnimation() {
    this.destroyed = false;

    if (!this.charElements || this.charElements.length === 0) return;

    const elements = this.charElements.map(el => el.nativeElement);

    // Stop any existing animation
    if (this.animation) {
      this.animation.stop();
    }

    // Create a continuous breathing effect (pulses from 0.3 to 1.0)
    // This removes any "hidden" (0 opacity) state for a smoother feel.
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
