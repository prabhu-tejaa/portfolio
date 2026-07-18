import { Injectable } from '@angular/core';

// Declare gtag globally so TypeScript knows it exists from our index.html
declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor() { }

  /**
   * Track a custom event in Google Analytics
   * @param eventName The name of the event (e.g., 'dialog_open', 'form_submit')
   * @param params Optional parameters to pass with the event (e.g., { type: 'contact' })
   */
  public trackEvent(eventName: string, params: any = {}): void {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    } else {
      console.warn('Google Analytics gtag is not available');
    }
  }
}
