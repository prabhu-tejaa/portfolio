import {
  HttpClient
} from "./chunk-L3JBI53C.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  Injectable,
  NgIf,
  Subject,
  catchError,
  inject,
  map,
  of,
  setClassMetadata,
  shareReplay,
  switchMap,
  takeUntil,
  timer,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-RLH7LS7N.js";

// src/app/services/quote.service.ts
var QuoteService = class _QuoteService {
  http = inject(HttpClient);
  localUrl = "assets/data/quotes.json";
  quotesCache$ = null;
  fallbackQuote = {
    q: "Design is not just what it looks like and feels like. Design is how it works.",
    a: "Steve Jobs"
  };
  getQuotes() {
    if (!this.quotesCache$) {
      this.quotesCache$ = this.http.get(this.localUrl).pipe(map((quotes) => quotes.filter((q) => {
        const wordCount = q.q.split(/\s+/).length;
        return q.q.length <= 150 && wordCount <= 25;
      })), shareReplay(1), catchError((error) => {
        console.error("Error loading local quotes:", error);
        return of([this.fallbackQuote]);
      }));
    }
    return this.quotesCache$;
  }
  getRandomQuote() {
    return this.getQuotes().pipe(map((quotes) => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      return quotes[randomIndex] || this.fallbackQuote;
    }));
  }
  static \u0275fac = function QuoteService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _QuoteService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _QuoteService, factory: _QuoteService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(QuoteService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/pages/home/home.component.ts
function HomeComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "p", 4);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 5);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("loading", ctx_r0.isLoading);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1('"', ctx_r0.currentQuote.q, '"');
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.currentQuote.a, "");
  }
}
var HomeComponent = class _HomeComponent {
  quoteService = inject(QuoteService);
  cdr = inject(ChangeDetectorRef);
  destroy$ = new Subject();
  currentQuote = null;
  isLoading = true;
  ngOnInit() {
    timer(0, 13e3).pipe(takeUntil(this.destroy$), switchMap(() => {
      this.isLoading = true;
      this.cdr.markForCheck();
      return timer(1e3).pipe(switchMap(() => this.quoteService.getRandomQuote()));
    })).subscribe((quote) => {
      this.currentQuote = quote;
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  static \u0275fac = function HomeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomeComponent, selectors: [["app-home"]], decls: 2, vars: 1, consts: [[1, "home-content"], ["class", "mobile-quote-container", 4, "ngIf"], [1, "mobile-quote-container"], [1, "quote-box"], [1, "quote-text"], [1, "quote-author"]], template: function HomeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275template(1, HomeComponent_div_1_Template, 6, 4, "div", 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.currentQuote);
    }
  }, dependencies: [CommonModule, NgIf], styles: ["\n\n[_nghost-%COMP%] {\n  position: relative;\n  z-index: 5;\n  pointer-events: none;\n}\n.home-content[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  padding: 120px 20px 20px 20px;\n  color: white;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: flex-end;\n  box-sizing: border-box;\n}\n.mobile-quote-container[_ngcontent-%COMP%] {\n  display: none;\n}\n@media (max-width: 768px) {\n  .mobile-quote-container[_ngcontent-%COMP%] {\n    display: flex;\n    width: 100%;\n    max-width: 320px;\n    margin-bottom: 140px;\n    animation: _ngcontent-%COMP%_fadeIn 1s ease-out;\n  }\n}\n.quote-box[_ngcontent-%COMP%] {\n  width: 100%;\n  text-align: center;\n  transition: opacity 1s ease;\n}\n.quote-box.loading[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.quote-box[_ngcontent-%COMP%]   .quote-text[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-style: italic;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 0 0 10px 0;\n  line-height: 1.4;\n  letter-spacing: 0.5px;\n}\n.quote-box[_ngcontent-%COMP%]   .quote-author[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: rgba(255, 255, 255, 0.55);\n  text-transform: uppercase;\n  letter-spacing: 2px;\n  margin: 0;\n  font-weight: 500;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=home.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HomeComponent, [{
    type: Component,
    args: [{ selector: "app-home", standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, template: '<div class="home-content">\r\n    <div class="mobile-quote-container" *ngIf="currentQuote">\r\n        <div class="quote-box" [class.loading]="isLoading">\r\n            <p class="quote-text">"{{ currentQuote.q }}"</p>\r\n            <p class="quote-author"> {{ currentQuote.a }}</p>\r\n        </div>\r\n    </div>\r\n</div>', styles: ["/* src/app/pages/home/home.component.scss */\n:host {\n  position: relative;\n  z-index: 5;\n  pointer-events: none;\n}\n.home-content {\n  min-height: 100vh;\n  padding: 120px 20px 20px 20px;\n  color: white;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: flex-end;\n  box-sizing: border-box;\n}\n.mobile-quote-container {\n  display: none;\n}\n@media (max-width: 768px) {\n  .mobile-quote-container {\n    display: flex;\n    width: 100%;\n    max-width: 320px;\n    margin-bottom: 140px;\n    animation: fadeIn 1s ease-out;\n  }\n}\n.quote-box {\n  width: 100%;\n  text-align: center;\n  transition: opacity 1s ease;\n}\n.quote-box.loading {\n  opacity: 0;\n}\n.quote-box .quote-text {\n  font-size: 0.9rem;\n  font-style: italic;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 0 0 10px 0;\n  line-height: 1.4;\n  letter-spacing: 0.5px;\n}\n.quote-box .quote-author {\n  font-size: 0.7rem;\n  color: rgba(255, 255, 255, 0.55);\n  text-transform: uppercase;\n  letter-spacing: 2px;\n  margin: 0;\n  font-weight: 500;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=home.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "src/app/pages/home/home.component.ts", lineNumber: 15 });
})();
export {
  HomeComponent
};
//# sourceMappingURL=chunk-QAB2WFKO.js.map
