import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteService, Quote } from '../../services/quote.service';
import { Subject, timer } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private quoteService = inject(QuoteService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  currentQuote: Quote | null = null;
  isLoading = true;

  ngOnInit() {
    // Initial fetch and 13s interval
    timer(0, 13000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          this.isLoading = true;
          this.cdr.markForCheck();
          // Ensure at least 1s for fade out animation
          return timer(1000).pipe(
            switchMap(() => this.quoteService.getRandomQuote())
          );
        })
      )
      .subscribe(quote => {
        this.currentQuote = quote;
        this.isLoading = false;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
