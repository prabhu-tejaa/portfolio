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
  
    const open = () => {
      this.animation = animate(
        elements,
        {
          opacity: [0, 1],
          filter: ['blur(10px)', 'blur(0px)']
        },
        {
          duration: 1.4,
          ease: 'easeOut',
          delay: stagger(0.045) // left → right
        }
      );
      return this.animation.finished;
    };
  
    const close = () => {
      this.animation = animate(
        elements,
        {
          opacity: [1, 0],
          filter: ['blur(0px)', 'blur(10px)']
        },
        {
          duration: 0.7,
          ease: 'easeIn',
          delay: stagger(0.045) // left → right (same direction)
        }
      );
      return this.animation.finished;
    };
  
    while (!this.destroyed) {
      await open();           // reveal
      if (this.destroyed) break;
  
      await this.sleep(700);  // stay visible
      if (this.destroyed) break;
  
      await close();          // hide
      if (this.destroyed) break;
  
      await this.sleep(120);  // stay hidden
    }
  }
  

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  trackByIndex(index: number) {
    return index;
  }
}
