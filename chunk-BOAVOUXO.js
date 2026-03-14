import {
  animate,
  group,
  query,
  stagger,
  style,
  transition,
  trigger
} from "./chunk-FYVBE6GJ.js";
import {
  ChangeDetectionStrategy,
  CommonModule,
  Component,
  NgIf,
  UpperCasePipe,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-RLH7LS7N.js";

// src/app/pages/work/work.component.ts
function WorkComponent_div_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275listener("click", function WorkComponent_div_51_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeDialog());
    });
    \u0275\u0275elementStart(1, "div", 23);
    \u0275\u0275listener("click", function WorkComponent_div_51_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 24)(3, "h3");
    \u0275\u0275text(4, "PROJECT DETAILS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 25);
    \u0275\u0275listener("click", function WorkComponent_div_51_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeDialog());
    });
    \u0275\u0275text(6, "\u2715");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 26)(8, "h2");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "uppercase");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p");
    \u0275\u0275text(12, "Full breakdown of contributions and technical impact.");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 1, ctx_r1.activeDialog));
  }
}
var WorkComponent = class _WorkComponent {
  activeDialog = null;
  selectedImage = null;
  adept = "assets/adeptchips_logo.jpeg";
  teamlease = "assets/TeamLease-Logo.png";
  images = {
    adapt: ["assets/adapt-dashboard-1.jpg", "assets/adapt-dashboard-2.jpg"],
    teamlease: ["assets/teamlease-ui-1.jpg", "assets/teamlease-ui-2.jpg"]
  };
  siemensHero = { logo: "assets/siemens-logo.png" };
  get currentProjectImages() {
    return this.activeDialog ? this.images[this.activeDialog] : [];
  }
  openDialog(type) {
    this.activeDialog = type;
  }
  closeDialog() {
    this.activeDialog = null;
  }
  openImage(src) {
    this.selectedImage = src;
  }
  closeImage() {
    this.selectedImage = null;
  }
  static \u0275fac = function WorkComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WorkComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WorkComponent, selectors: [["app-work"]], decls: 52, vars: 2, consts: [[1, "compact-editorial"], [1, "ambient-glow"], [1, "noise-film"], [1, "layout-grid"], [1, "anchor-pane"], [1, "timeline-label"], [1, "pane-inner"], [1, "vertical-title"], [1, "pane-footer"], [1, "label"], [1, "mono"], [1, "content-pane"], [1, "glass-card", 3, "click"], [1, "card-content"], [1, "card-top"], [1, "tag"], [1, "role"], [1, "card-body"], [1, "card-bot"], [1, "date"], [1, "icon"], ["class", "dialog-veil", 3, "click", 4, "ngIf"], [1, "dialog-veil", 3, "click"], [1, "dialog-box", 3, "click"], [1, "dialog-header"], [3, "click"], [1, "dialog-body"]], template: function WorkComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0);
      \u0275\u0275element(1, "div", 1)(2, "div", 2);
      \u0275\u0275elementStart(3, "div", 3)(4, "div", 4)(5, "div", 5);
      \u0275\u0275text(6, "CONTRACT TIMELINE");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 6)(8, "div", 7)(9, "h1");
      \u0275\u0275text(10, "SIEMENS");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 8)(12, "span", 9);
      \u0275\u0275text(13, "CLIENT LOCATION");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "span", 10);
      \u0275\u0275text(15, "June 2022 \u2014 June 2024");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(16, "div", 11)(17, "div", 12);
      \u0275\u0275listener("click", function WorkComponent_Template_div_click_17_listener() {
        return ctx.openDialog("adapt");
      });
      \u0275\u0275elementStart(18, "div", 13)(19, "div", 14)(20, "span", 15);
      \u0275\u0275text(21, "CONTRACT 01 //");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "span", 16);
      \u0275\u0275text(23, "Software Engineer");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "div", 17)(25, "h2");
      \u0275\u0275text(26, "ADAPT CHIPS");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "p");
      \u0275\u0275text(28, "Developed desktop & mobile apps for IoT devices.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "div", 18)(30, "span", 19);
      \u0275\u0275text(31, "June 2022 \u2014 December 2023");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "span", 20);
      \u0275\u0275text(33, "\u2192");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(34, "div", 12);
      \u0275\u0275listener("click", function WorkComponent_Template_div_click_34_listener() {
        return ctx.openDialog("teamlease");
      });
      \u0275\u0275elementStart(35, "div", 13)(36, "div", 14)(37, "span", 15);
      \u0275\u0275text(38, "CONTRACT 02 //");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "span", 16);
      \u0275\u0275text(40, "Software Development Engineer");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(41, "div", 17)(42, "h2");
      \u0275\u0275text(43, "TEAMLEASE");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "p");
      \u0275\u0275text(45, "Built comprehensive driver onboarding app on Mendix.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(46, "div", 18)(47, "span", 19);
      \u0275\u0275text(48, "January 2024 \u2014 June 2024");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "span", 20);
      \u0275\u0275text(50, "\u2192");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275template(51, WorkComponent_div_51_Template, 13, 3, "div", 21);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("@pageAnimations", void 0);
      \u0275\u0275advance(51);
      \u0275\u0275property("ngIf", ctx.activeDialog);
    }
  }, dependencies: [CommonModule, NgIf, UpperCasePipe], styles: ['\n\n.compact-editorial[_ngcontent-%COMP%] {\n  height: 100vh;\n  width: 100%;\n  color: #ffffff;\n  font-family: "Inter", sans-serif;\n  overflow: hidden;\n  position: relative;\n  z-index: 10;\n  pointer-events: none;\n  padding: 80px 20px 20px 20px;\n  box-sizing: border-box;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.ambient-glow[_ngcontent-%COMP%], \n.noise-film[_ngcontent-%COMP%] {\n  display: none !important;\n}\n.layout-grid[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 10;\n  pointer-events: none;\n  width: 100%;\n  max-width: 1400px;\n  height: 100%;\n  display: flex;\n  gap: 20px;\n}\n@media (max-width: 1024px) {\n  .layout-grid[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 10px;\n  }\n}\n.anchor-pane[_ngcontent-%COMP%] {\n  flex: 0 0 25%;\n  height: 100%;\n  border-right: 1px solid rgba(255, 255, 255, 0.15);\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  will-change: transform, opacity;\n}\n@media (max-width: 1024px) {\n  .anchor-pane[_ngcontent-%COMP%] {\n    flex: 0 0 15%;\n    width: 100%;\n    border-right: none;\n    border-bottom: 1px solid rgba(255, 255, 255, 0.15);\n    flex-direction: row;\n    align-items: center;\n  }\n}\n.timeline-label[_ngcontent-%COMP%] {\n  position: absolute;\n  right: -9px;\n  top: 50%;\n  transform: translateY(-50%) rotate(180deg);\n  writing-mode: vertical-rl;\n  text-orientation: mixed;\n  background: #050505;\n  padding: 15px 0;\n  font-family: monospace;\n  font-size: 0.6rem;\n  letter-spacing: 3px;\n  color: rgba(255, 255, 255, 0.3);\n  text-transform: uppercase;\n  white-space: nowrap;\n  z-index: 5;\n}\n@media (max-width: 1024px) {\n  .timeline-label[_ngcontent-%COMP%] {\n    right: auto;\n    top: auto;\n    bottom: -10px;\n    left: 50%;\n    transform: translateX(-50%);\n    writing-mode: horizontal-tb;\n    padding: 0 15px;\n  }\n}\n.pane-inner[_ngcontent-%COMP%] {\n  height: 100%;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  padding: 20px;\n  box-sizing: border-box;\n}\n.logo-area[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 50px;\n  height: auto;\n  opacity: 0.9;\n}\n.vertical-title[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  writing-mode: vertical-rl;\n  transform: rotate(180deg);\n}\n.vertical-title[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 8vh;\n  margin: 0;\n  font-weight: 900;\n  letter-spacing: 1vh;\n  color: transparent;\n  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);\n  transition: 0.5s ease;\n}\n.vertical-title[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]:hover {\n  color: #00f3ff;\n  -webkit-text-stroke: 0px;\n  text-shadow: 0 0 4px #ffffff, 0 0 1px #ffffff;\n}\n@media (max-width: 1024px) {\n  .vertical-title[_ngcontent-%COMP%] {\n    writing-mode: horizontal-tb;\n    transform: none;\n  }\n  .vertical-title[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 2rem;\n    letter-spacing: 5px;\n  }\n}\n.pane-footer[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n.pane-footer[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: #00f3ff;\n  font-weight: bold;\n  letter-spacing: 1px;\n}\n.pane-footer[_ngcontent-%COMP%]   .mono[_ngcontent-%COMP%] {\n  font-family: monospace;\n  font-size: 0.7rem;\n  color: rgba(255, 255, 255, 0.5);\n}\n.content-pane[_ngcontent-%COMP%] {\n  flex: 1;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  gap: 3vh;\n  padding-left: 40px;\n}\n@media (max-width: 1024px) {\n  .content-pane[_ngcontent-%COMP%] {\n    padding-left: 0;\n    padding-top: 20px;\n  }\n}\n.glass-card[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 700px;\n  height: 28vh;\n  min-height: 160px;\n  background: rgba(255, 255, 255, 0.03);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  position: relative;\n  will-change: transform, opacity;\n  cursor: pointer;\n  pointer-events: auto;\n  transition: transform 0.3s ease, background 0.3s ease;\n  overflow: hidden;\n}\n.glass-card[_ngcontent-%COMP%]:first-child {\n  transform: translateX(0);\n}\n.glass-card[_ngcontent-%COMP%]:last-child {\n  left: 40px;\n}\n@media (max-width: 1024px) {\n  .glass-card[_ngcontent-%COMP%] {\n    left: 0;\n  }\n}\n.glass-card[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.08);\n  border-color: rgba(255, 255, 255, 0.4);\n  transform: scale(1.02);\n}\n.glass-card[_ngcontent-%COMP%]:hover   .icon[_ngcontent-%COMP%] {\n  color: #00f3ff;\n  transform: translateX(5px);\n}\n.card-content[_ngcontent-%COMP%] {\n  height: 100%;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 3vh 4vh;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n.card-top[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.card-top[_ngcontent-%COMP%]   .tag[_ngcontent-%COMP%] {\n  font-family: monospace;\n  font-size: 0.7rem;\n  color: rgba(255, 255, 255, 0.4);\n  letter-spacing: 1px;\n}\n.card-top[_ngcontent-%COMP%]   .role[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.1);\n  padding: 4px 8px;\n  font-size: 0.65rem;\n  font-weight: bold;\n  letter-spacing: 1px;\n  color: #00f3ff;\n  border-radius: 2px;\n}\n.card-body[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  flex: 1;\n}\n.card-body[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 2.2rem;\n  font-weight: 700;\n  color: white;\n  margin: 0 0 5px 0;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n}\n.card-body[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: rgba(255, 255, 255, 0.7);\n  font-weight: 300;\n  margin: 0;\n  max-width: 90%;\n  line-height: 1.4;\n}\n.card-bot[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-top: 1px solid rgba(255, 255, 255, 0.1);\n  padding-top: 1.5vh;\n}\n.card-bot[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%] {\n  font-family: monospace;\n  font-size: 0.75rem;\n  color: rgba(255, 255, 255, 0.5);\n}\n.card-bot[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  color: rgba(255, 255, 255, 0.3);\n  transition: 0.3s;\n}\n.dialog-veil[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.9);\n  z-index: 100;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.dialog-box[_ngcontent-%COMP%] {\n  width: 90%;\n  max-width: 500px;\n  background: #111;\n  border: 1px solid #ffffff;\n  padding: 30px;\n}\n.dialog-box[_ngcontent-%COMP%]   .dialog-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 20px;\n}\n.dialog-box[_ngcontent-%COMP%]   .dialog-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #00f3ff;\n  margin: 0;\n}\n.dialog-box[_ngcontent-%COMP%]   .dialog-header[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: white;\n  cursor: pointer;\n}\n/*# sourceMappingURL=work.component.css.map */'], data: { animation: [
    trigger("pageAnimations", [
      transition(":enter", [
        query(".timeline-label", [
          style({ opacity: 0, transform: "translateY(-40%) rotate(180deg)" })
        ], { optional: true }),
        query(".glass-card", [
          style({ opacity: 0, transform: "translateY(30px)" })
        ], { optional: true }),
        group([
          query(".anchor-pane", [
            animate("0.8s cubic-bezier(0.2, 0.8, 0.2, 1)", style({ opacity: 1, transform: "translateX(0)" }))
          ], { optional: true }),
          query(".timeline-label", [
            animate("0.6s 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)", style({ opacity: 1, transform: "translateY(-50%) rotate(180deg)" }))
          ], { optional: true }),
          query(".glass-card", stagger(200, [
            animate("0.7s 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)", style({ opacity: 1, transform: "translateY(0)" }))
          ]), { optional: true })
        ])
      ])
    ])
  ] }, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WorkComponent, [{
    type: Component,
    args: [{ selector: "app-work", standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, animations: [
      trigger("pageAnimations", [
        transition(":enter", [
          query(".timeline-label", [
            style({ opacity: 0, transform: "translateY(-40%) rotate(180deg)" })
          ], { optional: true }),
          query(".glass-card", [
            style({ opacity: 0, transform: "translateY(30px)" })
          ], { optional: true }),
          group([
            query(".anchor-pane", [
              animate("0.8s cubic-bezier(0.2, 0.8, 0.2, 1)", style({ opacity: 1, transform: "translateX(0)" }))
            ], { optional: true }),
            query(".timeline-label", [
              animate("0.6s 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)", style({ opacity: 1, transform: "translateY(-50%) rotate(180deg)" }))
            ], { optional: true }),
            query(".glass-card", stagger(200, [
              animate("0.7s 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)", style({ opacity: 1, transform: "translateY(0)" }))
            ]), { optional: true })
          ])
        ])
      ])
    ], template: `<section class="compact-editorial" [@pageAnimations]>\r
  <div class="ambient-glow"></div>\r
  <div class="noise-film"></div>\r
\r
  <div class="layout-grid">\r
    <div class="anchor-pane">\r
      <div class="timeline-label">CONTRACT TIMELINE</div>\r
      <div class="pane-inner">\r
        <div class="vertical-title">\r
          <h1>SIEMENS</h1>\r
        </div>\r
\r
        <div class="pane-footer">\r
          <span class="label">CLIENT LOCATION</span>\r
          <span class="mono">June 2022 \u2014 June 2024</span>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <div class="content-pane">\r
      <div class="glass-card" (click)="openDialog('adapt')">\r
        <div class="card-content">\r
          <div class="card-top">\r
            <span class="tag">CONTRACT 01 //</span>\r
            <span class="role">Software Engineer</span>\r
          </div>\r
\r
          <div class="card-body">\r
            <h2>ADAPT CHIPS</h2>\r
            <p>Developed desktop & mobile apps for IoT devices.</p>\r
          </div>\r
\r
          <div class="card-bot">\r
            <span class="date">June 2022 \u2014 December 2023</span>\r
            <span class="icon">\u2192</span>\r
          </div>\r
        </div>\r
      </div>\r
\r
      <div class="glass-card" (click)="openDialog('teamlease')">\r
        <div class="card-content">\r
          <div class="card-top">\r
            <span class="tag">CONTRACT 02 //</span>\r
            <span class="role">Software Development Engineer</span>\r
          </div>\r
\r
          <div class="card-body">\r
            <h2>TEAMLEASE</h2>\r
            <p>Built comprehensive driver onboarding app on Mendix.</p>\r
          </div>\r
\r
          <div class="card-bot">\r
            <span class="date">January 2024 \u2014 June 2024</span>\r
            <span class="icon">\u2192</span>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <div class="dialog-veil" *ngIf="activeDialog" (click)="closeDialog()">\r
    <div class="dialog-box" (click)="$event.stopPropagation()">\r
      <div class="dialog-header">\r
        <h3>PROJECT DETAILS</h3>\r
        <button (click)="closeDialog()">\u2715</button>\r
      </div>\r
      <div class="dialog-body">\r
        <h2>{{ activeDialog | uppercase }}</h2>\r
        <p>Full breakdown of contributions and technical impact.</p>\r
      </div>\r
    </div>\r
  </div>\r
</section>`, styles: ['/* src/app/pages/work/work.component.scss */\n.compact-editorial {\n  height: 100vh;\n  width: 100%;\n  color: #ffffff;\n  font-family: "Inter", sans-serif;\n  overflow: hidden;\n  position: relative;\n  z-index: 10;\n  pointer-events: none;\n  padding: 80px 20px 20px 20px;\n  box-sizing: border-box;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.ambient-glow,\n.noise-film {\n  display: none !important;\n}\n.layout-grid {\n  position: relative;\n  z-index: 10;\n  pointer-events: none;\n  width: 100%;\n  max-width: 1400px;\n  height: 100%;\n  display: flex;\n  gap: 20px;\n}\n@media (max-width: 1024px) {\n  .layout-grid {\n    flex-direction: column;\n    gap: 10px;\n  }\n}\n.anchor-pane {\n  flex: 0 0 25%;\n  height: 100%;\n  border-right: 1px solid rgba(255, 255, 255, 0.15);\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  will-change: transform, opacity;\n}\n@media (max-width: 1024px) {\n  .anchor-pane {\n    flex: 0 0 15%;\n    width: 100%;\n    border-right: none;\n    border-bottom: 1px solid rgba(255, 255, 255, 0.15);\n    flex-direction: row;\n    align-items: center;\n  }\n}\n.timeline-label {\n  position: absolute;\n  right: -9px;\n  top: 50%;\n  transform: translateY(-50%) rotate(180deg);\n  writing-mode: vertical-rl;\n  text-orientation: mixed;\n  background: #050505;\n  padding: 15px 0;\n  font-family: monospace;\n  font-size: 0.6rem;\n  letter-spacing: 3px;\n  color: rgba(255, 255, 255, 0.3);\n  text-transform: uppercase;\n  white-space: nowrap;\n  z-index: 5;\n}\n@media (max-width: 1024px) {\n  .timeline-label {\n    right: auto;\n    top: auto;\n    bottom: -10px;\n    left: 50%;\n    transform: translateX(-50%);\n    writing-mode: horizontal-tb;\n    padding: 0 15px;\n  }\n}\n.pane-inner {\n  height: 100%;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  padding: 20px;\n  box-sizing: border-box;\n}\n.logo-area img {\n  width: 50px;\n  height: auto;\n  opacity: 0.9;\n}\n.vertical-title {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  writing-mode: vertical-rl;\n  transform: rotate(180deg);\n}\n.vertical-title h1 {\n  font-size: 8vh;\n  margin: 0;\n  font-weight: 900;\n  letter-spacing: 1vh;\n  color: transparent;\n  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);\n  transition: 0.5s ease;\n}\n.vertical-title h1:hover {\n  color: #00f3ff;\n  -webkit-text-stroke: 0px;\n  text-shadow: 0 0 4px #ffffff, 0 0 1px #ffffff;\n}\n@media (max-width: 1024px) {\n  .vertical-title {\n    writing-mode: horizontal-tb;\n    transform: none;\n  }\n  .vertical-title h1 {\n    font-size: 2rem;\n    letter-spacing: 5px;\n  }\n}\n.pane-footer {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n.pane-footer .label {\n  font-size: 0.7rem;\n  color: #00f3ff;\n  font-weight: bold;\n  letter-spacing: 1px;\n}\n.pane-footer .mono {\n  font-family: monospace;\n  font-size: 0.7rem;\n  color: rgba(255, 255, 255, 0.5);\n}\n.content-pane {\n  flex: 1;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  gap: 3vh;\n  padding-left: 40px;\n}\n@media (max-width: 1024px) {\n  .content-pane {\n    padding-left: 0;\n    padding-top: 20px;\n  }\n}\n.glass-card {\n  width: 100%;\n  max-width: 700px;\n  height: 28vh;\n  min-height: 160px;\n  background: rgba(255, 255, 255, 0.03);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  position: relative;\n  will-change: transform, opacity;\n  cursor: pointer;\n  pointer-events: auto;\n  transition: transform 0.3s ease, background 0.3s ease;\n  overflow: hidden;\n}\n.glass-card:first-child {\n  transform: translateX(0);\n}\n.glass-card:last-child {\n  left: 40px;\n}\n@media (max-width: 1024px) {\n  .glass-card {\n    left: 0;\n  }\n}\n.glass-card:hover {\n  background: rgba(255, 255, 255, 0.08);\n  border-color: rgba(255, 255, 255, 0.4);\n  transform: scale(1.02);\n}\n.glass-card:hover .icon {\n  color: #00f3ff;\n  transform: translateX(5px);\n}\n.card-content {\n  height: 100%;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 3vh 4vh;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n.card-top {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.card-top .tag {\n  font-family: monospace;\n  font-size: 0.7rem;\n  color: rgba(255, 255, 255, 0.4);\n  letter-spacing: 1px;\n}\n.card-top .role {\n  background: rgba(255, 255, 255, 0.1);\n  padding: 4px 8px;\n  font-size: 0.65rem;\n  font-weight: bold;\n  letter-spacing: 1px;\n  color: #00f3ff;\n  border-radius: 2px;\n}\n.card-body {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  flex: 1;\n}\n.card-body h2 {\n  font-size: 2.2rem;\n  font-weight: 700;\n  color: white;\n  margin: 0 0 5px 0;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n}\n.card-body p {\n  font-size: 0.9rem;\n  color: rgba(255, 255, 255, 0.7);\n  font-weight: 300;\n  margin: 0;\n  max-width: 90%;\n  line-height: 1.4;\n}\n.card-bot {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-top: 1px solid rgba(255, 255, 255, 0.1);\n  padding-top: 1.5vh;\n}\n.card-bot .date {\n  font-family: monospace;\n  font-size: 0.75rem;\n  color: rgba(255, 255, 255, 0.5);\n}\n.card-bot .icon {\n  font-size: 1.2rem;\n  color: rgba(255, 255, 255, 0.3);\n  transition: 0.3s;\n}\n.dialog-veil {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.9);\n  z-index: 100;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.dialog-box {\n  width: 90%;\n  max-width: 500px;\n  background: #111;\n  border: 1px solid #ffffff;\n  padding: 30px;\n}\n.dialog-box .dialog-header {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 20px;\n}\n.dialog-box .dialog-header h3 {\n  font-size: 0.8rem;\n  color: #00f3ff;\n  margin: 0;\n}\n.dialog-box .dialog-header button {\n  background: none;\n  border: none;\n  color: white;\n  cursor: pointer;\n}\n/*# sourceMappingURL=work.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WorkComponent, { className: "WorkComponent", filePath: "src/app/pages/work/work.component.ts", lineNumber: 49 });
})();
export {
  WorkComponent
};
//# sourceMappingURL=chunk-BOAVOUXO.js.map
