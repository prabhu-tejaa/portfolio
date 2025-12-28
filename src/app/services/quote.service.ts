import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

export interface Quote {
    q: string; // quote
    a: string; // author
}

@Injectable({
    providedIn: 'root'
})
export class QuoteService {
    private http = inject(HttpClient);
    private localUrl = 'assets/data/quotes.json';
    private quotesCache$: Observable<Quote[]> | null = null;
    private fallbackQuote: Quote = {
        q: "Design is not just what it looks like and feels like. Design is how it works.",
        a: "Steve Jobs"
    };

    private getQuotes(): Observable<Quote[]> {
        if (!this.quotesCache$) {
            this.quotesCache$ = this.http.get<Quote[]>(this.localUrl).pipe(
                map((quotes: Quote[]) => quotes.filter(q => {
                    const wordCount = q.q.split(/\s+/).length;
                    return q.q.length <= 150 && wordCount <= 25;
                })),
                shareReplay(1),
                catchError(error => {
                    console.error('Error loading local quotes:', error);
                    return of([this.fallbackQuote]);
                })
            );
        }
        return this.quotesCache$ as Observable<Quote[]>;
    }

    getRandomQuote(): Observable<Quote> {
        return this.getQuotes().pipe(
            map(quotes => {
                const randomIndex = Math.floor(Math.random() * quotes.length);
                return quotes[randomIndex] || this.fallbackQuote;
            })
        );
    }
}
