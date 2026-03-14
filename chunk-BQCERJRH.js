import {
  animate,
  query,
  style,
  transition,
  trigger
} from "./chunk-FYVBE6GJ.js";
import {
  ChangeDetectionStrategy,
  CommonModule,
  Component,
  HostListener,
  NgForOf,
  NgIf,
  ViewChild,
  __spreadValues,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-RLH7LS7N.js";

// node_modules/lenis/dist/lenis.mjs
var version = "1.3.16";
function clamp(min, input, max) {
  return Math.max(min, Math.min(input, max));
}
function lerp(x, y, t) {
  return (1 - t) * x + t * y;
}
function damp(x, y, lambda, deltaTime) {
  return lerp(x, y, 1 - Math.exp(-lambda * deltaTime));
}
function modulo(n, d) {
  return (n % d + d) % d;
}
var Animate = class {
  isRunning = false;
  value = 0;
  from = 0;
  to = 0;
  currentTime = 0;
  // These are instanciated in the fromTo method
  lerp;
  duration;
  easing;
  onUpdate;
  /**
   * Advance the animation by the given delta time
   *
   * @param deltaTime - The time in seconds to advance the animation
   */
  advance(deltaTime) {
    if (!this.isRunning) return;
    let completed = false;
    if (this.duration && this.easing) {
      this.currentTime += deltaTime;
      const linearProgress = clamp(0, this.currentTime / this.duration, 1);
      completed = linearProgress >= 1;
      const easedProgress = completed ? 1 : this.easing(linearProgress);
      this.value = this.from + (this.to - this.from) * easedProgress;
    } else if (this.lerp) {
      this.value = damp(this.value, this.to, this.lerp * 60, deltaTime);
      if (Math.round(this.value) === this.to) {
        this.value = this.to;
        completed = true;
      }
    } else {
      this.value = this.to;
      completed = true;
    }
    if (completed) {
      this.stop();
    }
    this.onUpdate?.(this.value, completed);
  }
  /** Stop the animation */
  stop() {
    this.isRunning = false;
  }
  /**
   * Set up the animation from a starting value to an ending value
   * with optional parameters for lerping, duration, easing, and onUpdate callback
   *
   * @param from - The starting value
   * @param to - The ending value
   * @param options - Options for the animation
   */
  fromTo(from, to, {
    lerp: lerp2,
    duration,
    easing,
    onStart,
    onUpdate
  }) {
    this.from = this.value = from;
    this.to = to;
    this.lerp = lerp2;
    this.duration = duration;
    this.easing = easing;
    this.currentTime = 0;
    this.isRunning = true;
    onStart?.();
    this.onUpdate = onUpdate;
  }
};
function debounce(callback, delay) {
  let timer;
  return function(...args) {
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = void 0;
      callback.apply(context, args);
    }, delay);
  };
}
var Dimensions = class {
  constructor(wrapper, content, {
    autoResize = true,
    debounce: debounceValue = 250
  } = {}) {
    this.wrapper = wrapper;
    this.content = content;
    if (autoResize) {
      this.debouncedResize = debounce(this.resize, debounceValue);
      if (this.wrapper instanceof Window) {
        window.addEventListener("resize", this.debouncedResize, false);
      } else {
        this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize);
        this.wrapperResizeObserver.observe(this.wrapper);
      }
      this.contentResizeObserver = new ResizeObserver(this.debouncedResize);
      this.contentResizeObserver.observe(this.content);
    }
    this.resize();
  }
  width = 0;
  height = 0;
  scrollHeight = 0;
  scrollWidth = 0;
  // These are instanciated in the constructor as they need information from the options
  debouncedResize;
  wrapperResizeObserver;
  contentResizeObserver;
  destroy() {
    this.wrapperResizeObserver?.disconnect();
    this.contentResizeObserver?.disconnect();
    if (this.wrapper === window && this.debouncedResize) {
      window.removeEventListener("resize", this.debouncedResize, false);
    }
  }
  resize = () => {
    this.onWrapperResize();
    this.onContentResize();
  };
  onWrapperResize = () => {
    if (this.wrapper instanceof Window) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    } else {
      this.width = this.wrapper.clientWidth;
      this.height = this.wrapper.clientHeight;
    }
  };
  onContentResize = () => {
    if (this.wrapper instanceof Window) {
      this.scrollHeight = this.content.scrollHeight;
      this.scrollWidth = this.content.scrollWidth;
    } else {
      this.scrollHeight = this.wrapper.scrollHeight;
      this.scrollWidth = this.wrapper.scrollWidth;
    }
  };
  get limit() {
    return {
      x: this.scrollWidth - this.width,
      y: this.scrollHeight - this.height
    };
  }
};
var Emitter = class {
  events = {};
  /**
   * Emit an event with the given data
   * @param event Event name
   * @param args Data to pass to the event handlers
   */
  emit(event, ...args) {
    let callbacks = this.events[event] || [];
    for (let i = 0, length = callbacks.length; i < length; i++) {
      callbacks[i]?.(...args);
    }
  }
  /**
   * Add a callback to the event
   * @param event Event name
   * @param cb Callback function
   * @returns Unsubscribe function
   */
  on(event, cb) {
    this.events[event]?.push(cb) || (this.events[event] = [cb]);
    return () => {
      this.events[event] = this.events[event]?.filter((i) => cb !== i);
    };
  }
  /**
   * Remove a callback from the event
   * @param event Event name
   * @param callback Callback function
   */
  off(event, callback) {
    this.events[event] = this.events[event]?.filter((i) => callback !== i);
  }
  /**
   * Remove all event listeners and clean up
   */
  destroy() {
    this.events = {};
  }
};
var LINE_HEIGHT = 100 / 6;
var listenerOptions = {
  passive: false
};
var VirtualScroll = class {
  constructor(element, options = {
    wheelMultiplier: 1,
    touchMultiplier: 1
  }) {
    this.element = element;
    this.options = options;
    window.addEventListener("resize", this.onWindowResize, false);
    this.onWindowResize();
    this.element.addEventListener("wheel", this.onWheel, listenerOptions);
    this.element.addEventListener("touchstart", this.onTouchStart, listenerOptions);
    this.element.addEventListener("touchmove", this.onTouchMove, listenerOptions);
    this.element.addEventListener("touchend", this.onTouchEnd, listenerOptions);
  }
  touchStart = {
    x: 0,
    y: 0
  };
  lastDelta = {
    x: 0,
    y: 0
  };
  window = {
    width: 0,
    height: 0
  };
  emitter = new Emitter();
  /**
   * Add an event listener for the given event and callback
   *
   * @param event Event name
   * @param callback Callback function
   */
  on(event, callback) {
    return this.emitter.on(event, callback);
  }
  /** Remove all event listeners and clean up */
  destroy() {
    this.emitter.destroy();
    window.removeEventListener("resize", this.onWindowResize, false);
    this.element.removeEventListener("wheel", this.onWheel, listenerOptions);
    this.element.removeEventListener("touchstart", this.onTouchStart, listenerOptions);
    this.element.removeEventListener("touchmove", this.onTouchMove, listenerOptions);
    this.element.removeEventListener("touchend", this.onTouchEnd, listenerOptions);
  }
  /**
   * Event handler for 'touchstart' event
   *
   * @param event Touch event
   */
  onTouchStart = (event) => {
    const {
      clientX,
      clientY
    } = event.targetTouches ? event.targetTouches[0] : event;
    this.touchStart.x = clientX;
    this.touchStart.y = clientY;
    this.lastDelta = {
      x: 0,
      y: 0
    };
    this.emitter.emit("scroll", {
      deltaX: 0,
      deltaY: 0,
      event
    });
  };
  /** Event handler for 'touchmove' event */
  onTouchMove = (event) => {
    const {
      clientX,
      clientY
    } = event.targetTouches ? event.targetTouches[0] : event;
    const deltaX = -(clientX - this.touchStart.x) * this.options.touchMultiplier;
    const deltaY = -(clientY - this.touchStart.y) * this.options.touchMultiplier;
    this.touchStart.x = clientX;
    this.touchStart.y = clientY;
    this.lastDelta = {
      x: deltaX,
      y: deltaY
    };
    this.emitter.emit("scroll", {
      deltaX,
      deltaY,
      event
    });
  };
  onTouchEnd = (event) => {
    this.emitter.emit("scroll", {
      deltaX: this.lastDelta.x,
      deltaY: this.lastDelta.y,
      event
    });
  };
  /** Event handler for 'wheel' event */
  onWheel = (event) => {
    let {
      deltaX,
      deltaY,
      deltaMode
    } = event;
    const multiplierX = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.window.width : 1;
    const multiplierY = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.window.height : 1;
    deltaX *= multiplierX;
    deltaY *= multiplierY;
    deltaX *= this.options.wheelMultiplier;
    deltaY *= this.options.wheelMultiplier;
    this.emitter.emit("scroll", {
      deltaX,
      deltaY,
      event
    });
  };
  onWindowResize = () => {
    this.window = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  };
};
var defaultEasing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
var Lenis = class {
  _isScrolling = false;
  // true when scroll is animating
  _isStopped = false;
  // true if user should not be able to scroll - enable/disable programmatically
  _isLocked = false;
  // same as isStopped but enabled/disabled when scroll reaches target
  _preventNextNativeScrollEvent = false;
  _resetVelocityTimeout = null;
  __rafID = null;
  /**
   * Whether or not the user is touching the screen
   */
  isTouching;
  /**
   * The time in ms since the lenis instance was created
   */
  time = 0;
  /**
   * User data that will be forwarded through the scroll event
   *
   * @example
   * lenis.scrollTo(100, {
   *   userData: {
   *     foo: 'bar'
   *   }
   * })
   */
  userData = {};
  /**
   * The last velocity of the scroll
   */
  lastVelocity = 0;
  /**
   * The current velocity of the scroll
   */
  velocity = 0;
  /**
   * The direction of the scroll
   */
  direction = 0;
  /**
   * The options passed to the lenis instance
   */
  options;
  /**
   * The target scroll value
   */
  targetScroll;
  /**
   * The animated scroll value
   */
  animatedScroll;
  // These are instanciated here as they don't need information from the options
  animate = new Animate();
  emitter = new Emitter();
  // These are instanciated in the constructor as they need information from the options
  dimensions;
  // This is not private because it's used in the Snap class
  virtualScroll;
  constructor({
    wrapper = window,
    content = document.documentElement,
    eventsTarget = wrapper,
    smoothWheel = true,
    syncTouch = false,
    syncTouchLerp = 0.075,
    touchInertiaExponent = 1.7,
    duration,
    // in seconds
    easing,
    lerp: lerp2 = 0.1,
    infinite = false,
    orientation = "vertical",
    // vertical, horizontal
    gestureOrientation = orientation === "horizontal" ? "both" : "vertical",
    // vertical, horizontal, both
    touchMultiplier = 1,
    wheelMultiplier = 1,
    autoResize = true,
    prevent,
    virtualScroll,
    overscroll = true,
    autoRaf = false,
    anchors = false,
    autoToggle = false,
    // https://caniuse.com/?search=transition-behavior
    allowNestedScroll = false,
    __experimental__naiveDimensions = false
  } = {}) {
    window.lenisVersion = version;
    if (!wrapper || wrapper === document.documentElement) {
      wrapper = window;
    }
    if (typeof duration === "number" && typeof easing !== "function") {
      easing = defaultEasing;
    } else if (typeof easing === "function" && typeof duration !== "number") {
      duration = 1;
    }
    this.options = {
      wrapper,
      content,
      eventsTarget,
      smoothWheel,
      syncTouch,
      syncTouchLerp,
      touchInertiaExponent,
      duration,
      easing,
      lerp: lerp2,
      infinite,
      gestureOrientation,
      orientation,
      touchMultiplier,
      wheelMultiplier,
      autoResize,
      prevent,
      virtualScroll,
      overscroll,
      autoRaf,
      anchors,
      autoToggle,
      allowNestedScroll,
      __experimental__naiveDimensions
    };
    this.dimensions = new Dimensions(wrapper, content, {
      autoResize
    });
    this.updateClassName();
    this.targetScroll = this.animatedScroll = this.actualScroll;
    this.options.wrapper.addEventListener("scroll", this.onNativeScroll, false);
    this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, {
      capture: true
    });
    if (this.options.anchors && this.options.wrapper === window) {
      this.options.wrapper.addEventListener("click", this.onClick, false);
    }
    this.options.wrapper.addEventListener("pointerdown", this.onPointerDown, false);
    this.virtualScroll = new VirtualScroll(eventsTarget, {
      touchMultiplier,
      wheelMultiplier
    });
    this.virtualScroll.on("scroll", this.onVirtualScroll);
    if (this.options.autoToggle) {
      this.checkOverflow();
      this.rootElement.addEventListener("transitionend", this.onTransitionEnd, {
        passive: true
      });
    }
    if (this.options.autoRaf) {
      this.__rafID = requestAnimationFrame(this.raf);
    }
  }
  /**
   * Destroy the lenis instance, remove all event listeners and clean up the class name
   */
  destroy() {
    this.emitter.destroy();
    this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, false);
    this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, {
      capture: true
    });
    this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown, false);
    if (this.options.anchors && this.options.wrapper === window) {
      this.options.wrapper.removeEventListener("click", this.onClick, false);
    }
    this.virtualScroll.destroy();
    this.dimensions.destroy();
    this.cleanUpClassName();
    if (this.__rafID) {
      cancelAnimationFrame(this.__rafID);
    }
  }
  on(event, callback) {
    return this.emitter.on(event, callback);
  }
  off(event, callback) {
    return this.emitter.off(event, callback);
  }
  onScrollEnd = (e) => {
    if (!(e instanceof CustomEvent)) {
      if (this.isScrolling === "smooth" || this.isScrolling === false) {
        e.stopPropagation();
      }
    }
  };
  dispatchScrollendEvent = () => {
    this.options.wrapper.dispatchEvent(new CustomEvent("scrollend", {
      bubbles: this.options.wrapper === window,
      // cancelable: false,
      detail: {
        lenisScrollEnd: true
      }
    }));
  };
  get overflow() {
    const property = this.isHorizontal ? "overflow-x" : "overflow-y";
    return getComputedStyle(this.rootElement)[property];
  }
  checkOverflow() {
    if (["hidden", "clip"].includes(this.overflow)) {
      this.internalStop();
    } else {
      this.internalStart();
    }
  }
  onTransitionEnd = (event) => {
    if (event.propertyName.includes("overflow")) {
      this.checkOverflow();
    }
  };
  setScroll(scroll) {
    if (this.isHorizontal) {
      this.options.wrapper.scrollTo({
        left: scroll,
        behavior: "instant"
      });
    } else {
      this.options.wrapper.scrollTo({
        top: scroll,
        behavior: "instant"
      });
    }
  }
  onClick = (event) => {
    const path = event.composedPath();
    const anchor = path.find((node) => node instanceof HTMLAnchorElement && node.getAttribute("href")?.includes("#"));
    if (anchor) {
      const href = anchor.getAttribute("href");
      if (href) {
        const options = typeof this.options.anchors === "object" && this.options.anchors ? this.options.anchors : void 0;
        const target = `#${href.split("#")[1]}`;
        this.scrollTo(target, options);
      }
    }
  };
  onPointerDown = (event) => {
    if (event.button === 1) {
      this.reset();
    }
  };
  onVirtualScroll = (data) => {
    if (typeof this.options.virtualScroll === "function" && this.options.virtualScroll(data) === false) return;
    const {
      deltaX,
      deltaY,
      event
    } = data;
    this.emitter.emit("virtual-scroll", {
      deltaX,
      deltaY,
      event
    });
    if (event.ctrlKey) return;
    if (event.lenisStopPropagation) return;
    const isTouch = event.type.includes("touch");
    const isWheel = event.type.includes("wheel");
    this.isTouching = event.type === "touchstart" || event.type === "touchmove";
    const isClickOrTap = deltaX === 0 && deltaY === 0;
    const isTapToStop = this.options.syncTouch && isTouch && event.type === "touchstart" && isClickOrTap && !this.isStopped && !this.isLocked;
    if (isTapToStop) {
      this.reset();
      return;
    }
    const isUnknownGesture = this.options.gestureOrientation === "vertical" && deltaY === 0 || this.options.gestureOrientation === "horizontal" && deltaX === 0;
    if (isClickOrTap || isUnknownGesture) {
      return;
    }
    let composedPath = event.composedPath();
    composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
    const prevent = this.options.prevent;
    if (!!composedPath.find((node) => node instanceof HTMLElement && (typeof prevent === "function" && prevent?.(node) || node.hasAttribute?.("data-lenis-prevent") || isTouch && node.hasAttribute?.("data-lenis-prevent-touch") || isWheel && node.hasAttribute?.("data-lenis-prevent-wheel") || this.options.allowNestedScroll && this.checkNestedScroll(node, {
      deltaX,
      deltaY
    })))) return;
    if (this.isStopped || this.isLocked) {
      if (event.cancelable) {
        event.preventDefault();
      }
      return;
    }
    const isSmooth = this.options.syncTouch && isTouch || this.options.smoothWheel && isWheel;
    if (!isSmooth) {
      this.isScrolling = "native";
      this.animate.stop();
      event.lenisStopPropagation = true;
      return;
    }
    let delta = deltaY;
    if (this.options.gestureOrientation === "both") {
      delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
    } else if (this.options.gestureOrientation === "horizontal") {
      delta = deltaX;
    }
    if (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && this.limit > 0 && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && deltaY > 0 || this.animatedScroll === this.limit && deltaY < 0)) {
      event.lenisStopPropagation = true;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    const isSyncTouch = isTouch && this.options.syncTouch;
    const isTouchEnd = isTouch && event.type === "touchend";
    const hasTouchInertia = isTouchEnd;
    if (hasTouchInertia) {
      delta = Math.sign(this.velocity) * Math.pow(Math.abs(this.velocity), this.options.touchInertiaExponent);
    }
    this.scrollTo(this.targetScroll + delta, __spreadValues({
      programmatic: false
    }, isSyncTouch ? {
      lerp: hasTouchInertia ? this.options.syncTouchLerp : 1
      // immediate: !hasTouchInertia,
    } : {
      lerp: this.options.lerp,
      duration: this.options.duration,
      easing: this.options.easing
    }));
  };
  /**
   * Force lenis to recalculate the dimensions
   */
  resize() {
    this.dimensions.resize();
    this.animatedScroll = this.targetScroll = this.actualScroll;
    this.emit();
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  onNativeScroll = () => {
    if (this._resetVelocityTimeout !== null) {
      clearTimeout(this._resetVelocityTimeout);
      this._resetVelocityTimeout = null;
    }
    if (this._preventNextNativeScrollEvent) {
      this._preventNextNativeScrollEvent = false;
      return;
    }
    if (this.isScrolling === false || this.isScrolling === "native") {
      const lastScroll = this.animatedScroll;
      this.animatedScroll = this.targetScroll = this.actualScroll;
      this.lastVelocity = this.velocity;
      this.velocity = this.animatedScroll - lastScroll;
      this.direction = Math.sign(this.animatedScroll - lastScroll);
      if (!this.isStopped) {
        this.isScrolling = "native";
      }
      this.emit();
      if (this.velocity !== 0) {
        this._resetVelocityTimeout = setTimeout(() => {
          this.lastVelocity = this.velocity;
          this.velocity = 0;
          this.isScrolling = false;
          this.emit();
        }, 400);
      }
    }
  };
  reset() {
    this.isLocked = false;
    this.isScrolling = false;
    this.animatedScroll = this.targetScroll = this.actualScroll;
    this.lastVelocity = this.velocity = 0;
    this.animate.stop();
  }
  /**
   * Start lenis scroll after it has been stopped
   */
  start() {
    if (!this.isStopped) return;
    if (this.options.autoToggle) {
      this.rootElement.style.removeProperty("overflow");
      return;
    }
    this.internalStart();
  }
  internalStart() {
    if (!this.isStopped) return;
    this.reset();
    this.isStopped = false;
    this.emit();
  }
  /**
   * Stop lenis scroll
   */
  stop() {
    if (this.isStopped) return;
    if (this.options.autoToggle) {
      this.rootElement.style.setProperty("overflow", "clip");
      return;
    }
    this.internalStop();
  }
  internalStop() {
    if (this.isStopped) return;
    this.reset();
    this.isStopped = true;
    this.emit();
  }
  /**
   * RequestAnimationFrame for lenis
   *
   * @param time The time in ms from an external clock like `requestAnimationFrame` or Tempus
   */
  raf = (time) => {
    const deltaTime = time - (this.time || time);
    this.time = time;
    this.animate.advance(deltaTime * 1e-3);
    if (this.options.autoRaf) {
      this.__rafID = requestAnimationFrame(this.raf);
    }
  };
  /**
   * Scroll to a target value
   *
   * @param target The target value to scroll to
   * @param options The options for the scroll
   *
   * @example
   * lenis.scrollTo(100, {
   *   offset: 100,
   *   duration: 1,
   *   easing: (t) => 1 - Math.cos((t * Math.PI) / 2),
   *   lerp: 0.1,
   *   onStart: () => {
   *     console.log('onStart')
   *   },
   *   onComplete: () => {
   *     console.log('onComplete')
   *   },
   * })
   */
  scrollTo(target, {
    offset = 0,
    immediate = false,
    lock = false,
    duration = this.options.duration,
    easing = this.options.easing,
    lerp: lerp2 = this.options.lerp,
    onStart,
    onComplete,
    force = false,
    // scroll even if stopped
    programmatic = true,
    // called from outside of the class
    userData
  } = {}) {
    if ((this.isStopped || this.isLocked) && !force) return;
    if (typeof target === "string" && ["top", "left", "start", "#"].includes(target)) {
      target = 0;
    } else if (typeof target === "string" && ["bottom", "right", "end"].includes(target)) {
      target = this.limit;
    } else {
      let node;
      if (typeof target === "string") {
        node = document.querySelector(target);
        if (!node) {
          if (target === "#top") {
            target = 0;
          } else {
            console.warn("Lenis: Target not found", target);
          }
        }
      } else if (target instanceof HTMLElement && target?.nodeType) {
        node = target;
      }
      if (node) {
        if (this.options.wrapper !== window) {
          const wrapperRect = this.rootElement.getBoundingClientRect();
          offset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
        }
        const rect = node.getBoundingClientRect();
        target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll;
      }
    }
    if (typeof target !== "number") return;
    target += offset;
    target = Math.round(target);
    if (this.options.infinite) {
      if (programmatic) {
        this.targetScroll = this.animatedScroll = this.scroll;
        const distance = target - this.animatedScroll;
        if (distance > this.limit / 2) {
          target = target - this.limit;
        } else if (distance < -this.limit / 2) {
          target = target + this.limit;
        }
      }
    } else {
      target = clamp(0, target, this.limit);
    }
    if (target === this.targetScroll) {
      onStart?.(this);
      onComplete?.(this);
      return;
    }
    this.userData = userData ?? {};
    if (immediate) {
      this.animatedScroll = this.targetScroll = target;
      this.setScroll(this.scroll);
      this.reset();
      this.preventNextNativeScrollEvent();
      this.emit();
      onComplete?.(this);
      this.userData = {};
      requestAnimationFrame(() => {
        this.dispatchScrollendEvent();
      });
      return;
    }
    if (!programmatic) {
      this.targetScroll = target;
    }
    if (typeof duration === "number" && typeof easing !== "function") {
      easing = defaultEasing;
    } else if (typeof easing === "function" && typeof duration !== "number") {
      duration = 1;
    }
    this.animate.fromTo(this.animatedScroll, target, {
      duration,
      easing,
      lerp: lerp2,
      onStart: () => {
        if (lock) this.isLocked = true;
        this.isScrolling = "smooth";
        onStart?.(this);
      },
      onUpdate: (value, completed) => {
        this.isScrolling = "smooth";
        this.lastVelocity = this.velocity;
        this.velocity = value - this.animatedScroll;
        this.direction = Math.sign(this.velocity);
        this.animatedScroll = value;
        this.setScroll(this.scroll);
        if (programmatic) {
          this.targetScroll = value;
        }
        if (!completed) this.emit();
        if (completed) {
          this.reset();
          this.emit();
          onComplete?.(this);
          this.userData = {};
          requestAnimationFrame(() => {
            this.dispatchScrollendEvent();
          });
          this.preventNextNativeScrollEvent();
        }
      }
    });
  }
  preventNextNativeScrollEvent() {
    this._preventNextNativeScrollEvent = true;
    requestAnimationFrame(() => {
      this._preventNextNativeScrollEvent = false;
    });
  }
  checkNestedScroll(node, {
    deltaX,
    deltaY
  }) {
    const time = Date.now();
    const cache = node._lenis ??= {};
    let hasOverflowX, hasOverflowY, isScrollableX, isScrollableY, scrollWidth, scrollHeight, clientWidth, clientHeight;
    const gestureOrientation = this.options.gestureOrientation;
    if (time - (cache.time ?? 0) > 2e3) {
      cache.time = Date.now();
      const computedStyle = window.getComputedStyle(node);
      cache.computedStyle = computedStyle;
      const overflowXString = computedStyle.overflowX;
      const overflowYString = computedStyle.overflowY;
      hasOverflowX = ["auto", "overlay", "scroll"].includes(overflowXString);
      hasOverflowY = ["auto", "overlay", "scroll"].includes(overflowYString);
      cache.hasOverflowX = hasOverflowX;
      cache.hasOverflowY = hasOverflowY;
      if (!hasOverflowX && !hasOverflowY) return false;
      if (gestureOrientation === "vertical" && !hasOverflowY) return false;
      if (gestureOrientation === "horizontal" && !hasOverflowX) return false;
      scrollWidth = node.scrollWidth;
      scrollHeight = node.scrollHeight;
      clientWidth = node.clientWidth;
      clientHeight = node.clientHeight;
      isScrollableX = scrollWidth > clientWidth;
      isScrollableY = scrollHeight > clientHeight;
      cache.isScrollableX = isScrollableX;
      cache.isScrollableY = isScrollableY;
      cache.scrollWidth = scrollWidth;
      cache.scrollHeight = scrollHeight;
      cache.clientWidth = clientWidth;
      cache.clientHeight = clientHeight;
    } else {
      isScrollableX = cache.isScrollableX;
      isScrollableY = cache.isScrollableY;
      hasOverflowX = cache.hasOverflowX;
      hasOverflowY = cache.hasOverflowY;
      scrollWidth = cache.scrollWidth;
      scrollHeight = cache.scrollHeight;
      clientWidth = cache.clientWidth;
      clientHeight = cache.clientHeight;
    }
    if (!hasOverflowX && !hasOverflowY || !isScrollableX && !isScrollableY) {
      return false;
    }
    if (gestureOrientation === "vertical" && (!hasOverflowY || !isScrollableY)) return false;
    if (gestureOrientation === "horizontal" && (!hasOverflowX || !isScrollableX)) return false;
    let orientation;
    if (gestureOrientation === "horizontal") {
      orientation = "x";
    } else if (gestureOrientation === "vertical") {
      orientation = "y";
    } else {
      const isScrollingX = deltaX !== 0;
      const isScrollingY = deltaY !== 0;
      if (isScrollingX && hasOverflowX && isScrollableX) {
        orientation = "x";
      }
      if (isScrollingY && hasOverflowY && isScrollableY) {
        orientation = "y";
      }
    }
    if (!orientation) return false;
    let scroll, maxScroll, delta, hasOverflow, isScrollable;
    if (orientation === "x") {
      scroll = node.scrollLeft;
      maxScroll = scrollWidth - clientWidth;
      delta = deltaX;
      hasOverflow = hasOverflowX;
      isScrollable = isScrollableX;
    } else if (orientation === "y") {
      scroll = node.scrollTop;
      maxScroll = scrollHeight - clientHeight;
      delta = deltaY;
      hasOverflow = hasOverflowY;
      isScrollable = isScrollableY;
    } else {
      return false;
    }
    const willScroll = delta > 0 ? scroll < maxScroll : scroll > 0;
    return willScroll && hasOverflow && isScrollable;
  }
  /**
   * The root element on which lenis is instanced
   */
  get rootElement() {
    return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
  }
  /**
   * The limit which is the maximum scroll value
   */
  get limit() {
    if (this.options.__experimental__naiveDimensions) {
      if (this.isHorizontal) {
        return this.rootElement.scrollWidth - this.rootElement.clientWidth;
      } else {
        return this.rootElement.scrollHeight - this.rootElement.clientHeight;
      }
    } else {
      return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
    }
  }
  /**
   * Whether or not the scroll is horizontal
   */
  get isHorizontal() {
    return this.options.orientation === "horizontal";
  }
  /**
   * The actual scroll value
   */
  get actualScroll() {
    const wrapper = this.options.wrapper;
    return this.isHorizontal ? wrapper.scrollX ?? wrapper.scrollLeft : wrapper.scrollY ?? wrapper.scrollTop;
  }
  /**
   * The current scroll value
   */
  get scroll() {
    return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
  }
  /**
   * The progress of the scroll relative to the limit
   */
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  /**
   * Current scroll state
   */
  get isScrolling() {
    return this._isScrolling;
  }
  set isScrolling(value) {
    if (this._isScrolling !== value) {
      this._isScrolling = value;
      this.updateClassName();
    }
  }
  /**
   * Check if lenis is stopped
   */
  get isStopped() {
    return this._isStopped;
  }
  set isStopped(value) {
    if (this._isStopped !== value) {
      this._isStopped = value;
      this.updateClassName();
    }
  }
  /**
   * Check if lenis is locked
   */
  get isLocked() {
    return this._isLocked;
  }
  set isLocked(value) {
    if (this._isLocked !== value) {
      this._isLocked = value;
      this.updateClassName();
    }
  }
  /**
   * Check if lenis is smooth scrolling
   */
  get isSmooth() {
    return this.isScrolling === "smooth";
  }
  /**
   * The class name applied to the wrapper element
   */
  get className() {
    let className = "lenis";
    if (this.options.autoToggle) className += " lenis-autoToggle";
    if (this.isStopped) className += " lenis-stopped";
    if (this.isLocked) className += " lenis-locked";
    if (this.isScrolling) className += " lenis-scrolling";
    if (this.isScrolling === "smooth") className += " lenis-smooth";
    return className;
  }
  updateClassName() {
    this.cleanUpClassName();
    this.rootElement.className = `${this.rootElement.className} ${this.className}`.trim();
  }
  cleanUpClassName() {
    this.rootElement.className = this.rootElement.className.replace(/lenis(-\w+)?/g, "").trim();
  }
};

// src/app/pages/about/about.component.ts
var _c0 = ["container"];
function AboutComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "div", 7)(2, "div", 8)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(5, "div", 9);
    \u0275\u0275listener("click", function AboutComponent_div_4_Template_div_click_5_listener() {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openModal(item_r2));
    });
    \u0275\u0275elementStart(6, "span", 10);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h3");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 11)(11, "p", 12);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 13)(14, "span", 14);
    \u0275\u0275text(15, "\u2192");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const i_r4 = ctx.index;
    \u0275\u0275classProp("left", i_r4 % 2 === 0)("right", i_r4 % 2 !== 0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(item_r2.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r2.year);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r2.title);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r2.desc);
  }
}
function AboutComponent_div_5_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275listener("click", function AboutComponent_div_5_button_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.closeSubItem());
    });
    \u0275\u0275text(1, " \u2190 Back ");
    \u0275\u0275elementEnd();
  }
}
function AboutComponent_div_5_span_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.selectedItem == null ? null : ctx_r2.selectedItem.year);
  }
}
function AboutComponent_div_5_span_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.selectedItem == null ? null : ctx_r2.selectedItem.title);
  }
}
function AboutComponent_div_5_p_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.selectedItem == null ? null : ctx_r2.selectedItem.fullDesc);
  }
}
function AboutComponent_div_5_div_16_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 37);
    \u0275\u0275listener("click", function AboutComponent_div_5_div_16_div_1_Template_div_click_0_listener() {
      const sub_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.openSubItem(sub_r8));
    });
    \u0275\u0275elementStart(1, "div", 38);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 39)(4, "h3");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 40);
    \u0275\u0275text(9, "\u2192");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const sub_r8 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(sub_r8.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(sub_r8.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(sub_r8.desc);
  }
}
function AboutComponent_div_5_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275template(1, AboutComponent_div_5_div_16_div_1_Template, 10, 3, "div", 36);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.selectedItem.subItems);
  }
}
function AboutComponent_div_5_div_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41)(1, "p", 34);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.selectedSubItem.fullDesc);
  }
}
function AboutComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275listener("click", function AboutComponent_div_5_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeModal());
    });
    \u0275\u0275elementStart(1, "div", 16);
    \u0275\u0275listener("click", function AboutComponent_div_5_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r5);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "button", 17);
    \u0275\u0275listener("click", function AboutComponent_div_5_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeModal());
    });
    \u0275\u0275text(3, "\xD7");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 18);
    \u0275\u0275template(5, AboutComponent_div_5_button_5_Template, 2, 0, "button", 19);
    \u0275\u0275elementStart(6, "div", 20)(7, "span", 21);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 22);
    \u0275\u0275template(10, AboutComponent_div_5_span_10_Template, 2, 1, "span", 23)(11, AboutComponent_div_5_span_11_Template, 2, 1, "span", 24);
    \u0275\u0275elementStart(12, "h2");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "div", 25);
    \u0275\u0275template(15, AboutComponent_div_5_p_15_Template, 2, 1, "p", 26)(16, AboutComponent_div_5_div_16_Template, 2, 1, "div", 27)(17, AboutComponent_div_5_div_17_Template, 3, 1, "div", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 29);
    \u0275\u0275element(19, "div", 30);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r2.selectedSubItem);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.selectedSubItem ? ctx_r2.selectedSubItem.icon : ctx_r2.selectedItem == null ? null : ctx_r2.selectedItem.icon);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", !ctx_r2.selectedSubItem);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.selectedSubItem);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.selectedSubItem ? ctx_r2.selectedSubItem.title : ctx_r2.selectedItem == null ? null : ctx_r2.selectedItem.title);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", !(ctx_r2.selectedItem == null ? null : ctx_r2.selectedItem.subItems));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r2.selectedItem == null ? null : ctx_r2.selectedItem.subItems) && !ctx_r2.selectedSubItem);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.selectedSubItem);
  }
}
var AboutComponent = class _AboutComponent {
  containerRef;
  lenis = null;
  rafId = null;
  isModalOpen = false;
  selectedItem = null;
  selectedSubItem = null;
  // Track nested navigation state
  timeline = [
    {
      year: "1996",
      title: "The Origin",
      desc: "Born in Tenali, raised between my grandparents\u2019 home and Bapatla.",
      fullDesc: `My story didn't actually start in 1996; it began long before my first breath.

In June 1995, the specific cells that would become me were already in motion, spending months maturing and preparing. By the final week of December, just as the year was coming to an end, the spark of my life finally took hold.

Nine months later, on a rainy Saturday September 21, 1996 I arrived at Uma Hospital in Tenali. The half-hour between 12:30 and 1:00 PM was a fragile time. I had swallowed amniotic fluid in the womb, and my right foot was turned completely outward.

It was a complicated entrance, but nature has its own way of healing. Within a month, my foot corrected itself and the initial fears of the doctors began to fade.

My early years were a mix of two worlds: the warmth of my grandparents' homes in Tenali and the time we spent in Bapatla for my father\u2019s work. I celebrated my first birthday at my grandfather\u2019s house\u2014the same home where my father grew up.

In 1999, my sister was born at that same hospital in Tenali, rooting our family even deeper into the history of that place.`,
      icon: "\u2728"
    },
    {
      year: "2000 - 2026",
      title: "Academic Foundation",
      desc: "A comprehensive timeline of foundational schooling and higher education.",
      fullDesc: `Foundational & Secondary Education:
\u2022 2000 - 2002: St. John's High School, Gannavaram (Primary Education)
\u2022 2002 - 2006: Loyola Public School, Nallapadu (Elementary Studies)
\u2022 2006 - 2008: Narayana Concept School, Tarnaka (Middle School)
\u2022 2008 - 2010: David Memorial High School, Tarnaka (Middle School)
\u2022 2010 - 2012: Bhashyam Public School, Habsiguda (Secondary Education)

Higher Secondary & Professional Studies:
\u2022 2012 - 2015: Intermediate Studies | Sri Chaitanya Junior College, Habsiguda
\u2022 2015 - 2017: Undergraduate Coursework in Civil Engineering | St. Ann's Engineering College, Chirala
\u2022 2018: Bachelor of Science (B.Sc.) in Computer Science | Calorx Teachers' University, Gujarat
\u2022 2024 - 2026: Master of Computer Applications (MCA) | Vellore Institute of Technology (VIT)`,
      icon: "\u{1F393}"
    },
    {
      year: "2020 - Present",
      title: "Professional Orbit",
      desc: "A timeline of corporate operations, specialized training, and long-term consulting.",
      fullDesc: `Career Milestones & Corporate Training:
\u2022 Feb 2020 - March 2020: Medical Sales Representative | Nouveau Medicament
- Initiated career with a 15-day intensive corporate training program at the Chennai headquarters.
- Executed field operations and medical sales strategies within the Visakhapatnam (Vizag) sector.

Strategic Professional Tenure:
\u2022 June 17, 2022 - June 30, 2024: External Consultant | Siemens
- Dedicated a 24-month tenure as a full-time external resource, maintaining consistent daily office operations.
- Navigated corporate payroll and contract transitions seamlessly:
  - First 1.5 Years: Payroll and contract managed through Adept Chips.
  - Final 6 Months: Successfully transitioned to TeamLease for payroll management.`,
      icon: "\u{1F4BC}"
    },
    {
      year: "\u221E",
      title: "Personal Horizon",
      desc: "Passionate about gaming, space exploration, and continuous learning.",
      icon: "\u{1F320}",
      // Sub-items for the nested modal navigation
      subItems: [
        {
          title: "The Virtual Tactician",
          icon: "\u{1F3AE}",
          desc: "A strategic mind honed through immersive gaming worlds.",
          fullDesc: `"It all started with this massive Windows setup my dad brought home\u2014huge monitor, heavy CPU, the works. I was only four, but I was already hooked.

My dad used to put passwords on it to keep me away, but that backfired. Being locked out didn't stop me; it just made me obsessed. I\u2019d sit there staring at the screen, wondering what was happening behind that lock and how I could get inside. That curiosity was the first spark.

When I finally got in, it was a total immersion. I started with the old-school 2D GTA and Vice City, eventually moving through everything from the emotional weight of The Last of Us Part II and Life is Strange to the pure chaos of High on Life.

Whether I was on a PS4, Xbox, or PC, I realized playing a game is like living a character\u2019s story\u2014it actually changes how your brain evolves. I saw how PUBG Mobile united the world when we were all stuck inside during COVID, and it hit me: this space is powerful.

Those were the stepping stones. That childhood wonder of wanting to 'create something in this space' never left me. It\u2019s what drove me into software engineering. In life, you have to find your lane; I found mine in the logic and the stories that make the virtual world feel real.".`
        },
        {
          title: "The Cosmic Observer",
          icon: "\u{1F680}",
          desc: "Fascinated by the mechanics of the universe and space tech.",
          fullDesc: `Space has always captivated me. From the engineering marvels of SpaceX's reusable rockets to the physics of black holes, I am an avid follower of cosmic exploration.

I closely follow mission launches, astronomical discoveries, and the evolving narrative of humanity's journey to the stars. This curiosity drives me to understand complex systems, whether they are orbiting in space or running in a cloud server.`
        },
        {
          title: "Major events in life",
          icon: "\u{1F4BB}",
          desc: "Building, breaking, and refining code for the love of creation.",
          fullDesc: `Coding isn't just a job; it's a craft. I love the process of turning abstract logic into tangible, interactive experiences.

My "Personal Horizon" in tech involves constantly exploring new frameworks, optimizing performance, and creating interfaces that feel alive. This portfolio itself is a testament to that passion\u2014a playground where 3D graphics, physics, and rigorous logic collide.`
        },
        {
          title: "The Earthly Explorer",
          icon: "\u{1F30D}",
          desc: "Finding balance through travel and new perspectives.",
          fullDesc: `When I step away from the screen, I seek the grounding nature of the real world. Traveling allows me to reset, gain new perspectives, and appreciate the analog beauty of life.

Every trip is a reminder that while the digital world is limitless, the physical world offers a depth of experience that fuels creativity and resilience.`
        }
      ]
    }
  ];
  onEscapeKeydown() {
    if (this.isModalOpen) {
      if (this.selectedSubItem) {
        this.closeSubItem();
      } else {
        this.closeModal();
      }
    }
  }
  ngOnInit() {
  }
  openModal(item) {
    this.selectedItem = item;
    this.selectedSubItem = null;
    this.isModalOpen = true;
    this.lenis?.stop();
  }
  closeModal() {
    this.isModalOpen = false;
    this.lenis?.start();
    setTimeout(() => {
      this.selectedItem = null;
      this.selectedSubItem = null;
    }, 300);
  }
  // --- Nested Navigation Methods ---
  openSubItem(subItem) {
    this.selectedSubItem = subItem;
  }
  closeSubItem() {
    this.selectedSubItem = null;
  }
  ngAfterViewInit() {
    this.lenis = new Lenis({
      wrapper: this.containerRef.nativeElement,
      content: this.containerRef.nativeElement.querySelector(".timeline"),
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false
    });
    const raf = (time) => {
      this.lenis?.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };
    this.rafId = requestAnimationFrame(raf);
  }
  ngOnDestroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.lenis?.destroy();
  }
  static \u0275fac = function AboutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AboutComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AboutComponent, selectors: [["app-about"]], viewQuery: function AboutComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.containerRef = _t.first);
    }
  }, hostBindings: function AboutComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function AboutComponent_keydown_escape_HostBindingHandler() {
        return ctx.onEscapeKeydown();
      }, false, \u0275\u0275resolveDocument);
    }
  }, decls: 6, vars: 4, consts: [["container", ""], [1, "about-container"], [1, "timeline"], [1, "center-line"], ["class", "event-row", 3, "left", "right", 4, "ngFor", "ngForOf"], ["class", "modal-overlay", 3, "click", 4, "ngIf"], [1, "event-row"], [1, "dot-column"], [1, "dot"], [1, "content-card", 3, "click"], [1, "year"], [1, "description-wrapper"], [1, "truncate-text"], [1, "discovery-hint"], [1, "hint-symbol"], [1, "modal-overlay", 3, "click"], [1, "modal-content", 3, "click"], [1, "close-btn", 3, "click"], [1, "modal-header"], ["class", "back-btn", 3, "click", 4, "ngIf"], [1, "header-icon-container"], [1, "modal-icon"], [1, "header-text"], ["class", "modal-year", 4, "ngIf"], ["class", "modal-category", 4, "ngIf"], ["data-lenis-prevent", "", 1, "modal-body"], ["class", "main-text", 4, "ngIf"], ["class", "sub-item-grid", 4, "ngIf"], ["class", "detail-view", 4, "ngIf"], [1, "modal-footer"], [1, "galactic-line"], [1, "back-btn", 3, "click"], [1, "modal-year"], [1, "modal-category"], [1, "main-text"], [1, "sub-item-grid"], ["class", "glass-card", 3, "click", 4, "ngFor", "ngForOf"], [1, "glass-card", 3, "click"], [1, "card-icon"], [1, "card-content"], [1, "enter-symbol"], [1, "detail-view"]], template: function AboutComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 1, 0)(2, "div", 2);
      \u0275\u0275element(3, "div", 3);
      \u0275\u0275template(4, AboutComponent_div_4_Template, 16, 8, "div", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275template(5, AboutComponent_div_5_Template, 20, 8, "div", 5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classProp("modal-open", ctx.isModalOpen);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngForOf", ctx.timeline);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.isModalOpen);
    }
  }, dependencies: [CommonModule, NgForOf, NgIf], styles: ["\n\n.about-container[_ngcontent-%COMP%] {\n  height: 100vh;\n  width: 100%;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding-top: 120px;\n  padding-bottom: 100px;\n  padding-left: 20px;\n  padding-right: 20px;\n  box-sizing: border-box;\n  color: white;\n  position: relative;\n  z-index: 10;\n  scroll-behavior: smooth;\n}\n@media (max-width: 768px) {\n  .about-container[_ngcontent-%COMP%] {\n    padding-left: 0;\n    padding-right: 40px;\n  }\n}\n.about-container[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n.about-container[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.about-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: rgba(0, 243, 255, 0.2);\n  border-radius: 3px;\n}\n.about-container.modal-open[_ngcontent-%COMP%] {\n  overflow: hidden;\n  z-index: 9999;\n}\n.header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 80px;\n  animation: _ngcontent-%COMP%_fadeInDown 1s ease-out;\n}\n.header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  font-weight: 700;\n  letter-spacing: 2px;\n  margin: 0;\n  text-transform: uppercase;\n  text-shadow: 0 0 20px rgba(0, 243, 255, 0.5);\n}\n.header[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: rgba(255, 255, 255, 0.6);\n  margin-top: 10px;\n  letter-spacing: 4px;\n  text-transform: uppercase;\n}\n.timeline[_ngcontent-%COMP%] {\n  position: relative;\n  max-width: 1000px;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n.center-line[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  top: 50px;\n  bottom: 50px;\n  width: 2px;\n  background:\n    linear-gradient(\n      to bottom,\n      transparent,\n      #00f3ff,\n      transparent);\n  transform: translateX(-50%);\n  box-shadow: 0 0 15px #00f3ff;\n  opacity: 0.5;\n}\n@media (max-width: 768px) {\n  .center-line[_ngcontent-%COMP%] {\n    left: 42.5px;\n    transform: none;\n  }\n}\n.event-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 60px 1fr;\n  align-items: stretch;\n  width: 100%;\n  max-width: 1000px;\n  margin: 0 auto 10px auto;\n  gap: 10px;\n  position: relative;\n}\n@media (max-width: 768px) {\n  .event-row[_ngcontent-%COMP%] {\n    grid-template-columns: 45px 1fr;\n    margin-bottom: 25px;\n    gap: 15px;\n  }\n}\n.event-row[_ngcontent-%COMP%]   .dot-column[_ngcontent-%COMP%] {\n  grid-column: 2;\n  grid-row: 1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n  z-index: 2;\n}\n@media (max-width: 768px) {\n  .event-row[_ngcontent-%COMP%]   .dot-column[_ngcontent-%COMP%] {\n    grid-column: 1;\n  }\n}\n.event-row.left[_ngcontent-%COMP%]   .content-card[_ngcontent-%COMP%] {\n  grid-column: 1;\n  grid-row: 1;\n  text-align: right;\n  justify-self: end;\n  align-self: center;\n  width: 100%;\n  max-width: 450px;\n}\n@media (max-width: 768px) {\n  .event-row.left[_ngcontent-%COMP%]   .content-card[_ngcontent-%COMP%] {\n    grid-column: 2;\n    text-align: left;\n    justify-self: start;\n    max-width: 100%;\n  }\n}\n.event-row.right[_ngcontent-%COMP%]   .content-card[_ngcontent-%COMP%] {\n  grid-column: 3;\n  grid-row: 1;\n  text-align: left;\n  justify-self: start;\n  align-self: center;\n  width: 100%;\n  max-width: 450px;\n}\n@media (max-width: 768px) {\n  .event-row.right[_ngcontent-%COMP%]   .content-card[_ngcontent-%COMP%] {\n    grid-column: 2;\n    max-width: 100%;\n  }\n}\n.dot[_ngcontent-%COMP%] {\n  width: 55px;\n  height: 55px;\n  background: rgba(10, 10, 10, 0.9);\n  border: 1px solid rgba(0, 243, 255, 0.4);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.6rem;\n  z-index: 2;\n  box-shadow: 0 0 20px rgba(0, 243, 255, 0.2), inset 0 0 10px rgba(0, 243, 255, 0.1);\n  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n  flex-shrink: 0;\n}\n@media (max-width: 768px) {\n  .dot[_ngcontent-%COMP%] {\n    width: 45px;\n    height: 45px;\n    font-size: 1.3rem;\n  }\n}\n.dot[_ngcontent-%COMP%]:hover {\n  transform: scale(1.15) rotate(5deg);\n  border-color: #00f3ff;\n  box-shadow: 0 0 30px rgba(0, 243, 255, 0.5);\n  background: rgba(0, 243, 255, 0.05);\n}\n.content-card[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 450px;\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  padding: 25px;\n  border-radius: 15px;\n  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n  cursor: pointer;\n  position: relative;\n  overflow: hidden;\n  z-index: 5;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n@media (max-width: 768px) {\n  .content-card[_ngcontent-%COMP%] {\n    max-width: 100%;\n    padding: 20px;\n  }\n}\n.content-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 10px 0;\n  font-size: 1.5rem;\n}\n.content-card[_ngcontent-%COMP%]   .year[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.8rem;\n  color: #00f3ff;\n  margin-bottom: 5px;\n  font-weight: 500;\n}\n.content-card[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.08);\n  transform: translateY(-8px) scale(1.02);\n  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 243, 255, 0.1);\n  border-color: rgba(0, 243, 255, 0.3);\n}\n.content-card[_ngcontent-%COMP%]:hover   .discovery-hint[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: translateX(3px);\n}\n.content-card[_ngcontent-%COMP%]   .description-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  margin-top: 10px;\n}\n.content-card[_ngcontent-%COMP%]   p.truncate-text[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1rem;\n  color: #ccc;\n  line-height: 1.6;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  flex-grow: 1;\n}\n.content-card[_ngcontent-%COMP%]   .discovery-hint[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  opacity: 0.5;\n  transition: all 0.3s ease;\n  flex-shrink: 0;\n}\n.content-card[_ngcontent-%COMP%]   .discovery-hint[_ngcontent-%COMP%]   .hint-symbol[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: #00f3ff;\n  text-shadow: 0 0 10px #00f3ff;\n}\n.modal-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.1);\n  backdrop-filter: blur(8px);\n  z-index: 2000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  animation: _ngcontent-%COMP%_fadeIn 0.4s ease-out;\n}\n@media (max-width: 768px) {\n  .modal-overlay[_ngcontent-%COMP%] {\n    padding-left: 0;\n    padding-right: 45px;\n  }\n}\n.modal-content[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 700px;\n  max-height: 80vh;\n  background: rgba(15, 15, 15, 0.25);\n  backdrop-filter: blur(40px) saturate(200%);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 24px;\n  padding: 30px;\n  position: relative;\n  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(255, 255, 255, 0.05);\n  display: flex;\n  flex-direction: column;\n  animation: _ngcontent-%COMP%_modalSlideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n  overflow: hidden;\n}\n@media (max-width: 768px) {\n  .modal-content[_ngcontent-%COMP%] {\n    padding: 20px;\n    padding-right: 25px;\n  }\n}\n.modal-content[_ngcontent-%COMP%]   .close-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 15px;\n  right: 15px;\n  background: transparent;\n  border: none;\n  color: rgba(255, 255, 255, 0.6);\n  font-size: 1.8rem;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  line-height: 1;\n  z-index: 10000;\n  width: 44px;\n  height: 44px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n}\n.modal-content[_ngcontent-%COMP%]   .close-btn[_ngcontent-%COMP%]:hover {\n  color: #00f3ff;\n  background: rgba(0, 243, 255, 0.1);\n  transform: rotate(90deg) scale(1.1);\n  box-shadow: 0 0 15px rgba(0, 243, 255, 0.2);\n}\n.modal-content[_ngcontent-%COMP%]   .close-btn[_ngcontent-%COMP%]:active {\n  transform: scale(0.9);\n  background: rgba(255, 255, 255, 0.2);\n}\n.modal-content[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 25px;\n  margin-bottom: 30px;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   .back-btn[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: #00f3ff;\n  font-size: 0.9rem;\n  font-weight: 600;\n  cursor: pointer;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  transition: all 0.3s;\n  opacity: 0;\n  animation: _ngcontent-%COMP%_fadeIn 0.4s ease-out forwards 0.2s;\n  margin-right: 10px;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   .back-btn[_ngcontent-%COMP%]:hover {\n  letter-spacing: 2px;\n  text-shadow: 0 0 10px rgba(0, 243, 255, 0.4);\n}\n.modal-content[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   .header-icon-container[_ngcontent-%COMP%] {\n  width: 60px;\n  height: 60px;\n  background: rgba(0, 243, 255, 0.1);\n  border: 1px solid rgba(0, 243, 255, 0.3);\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 2.2rem;\n  box-shadow: inset 0 0 20px rgba(0, 243, 255, 0.1);\n}\n.modal-content[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   .header-text[_ngcontent-%COMP%]   .modal-year[_ngcontent-%COMP%] {\n  display: block;\n  color: #00f3ff;\n  font-size: 0.9rem;\n  letter-spacing: 2px;\n  margin-bottom: 5px;\n  font-weight: 600;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   .header-text[_ngcontent-%COMP%]   .modal-category[_ngcontent-%COMP%] {\n  display: block;\n  color: rgba(255, 255, 255, 0.5);\n  font-size: 0.8rem;\n  letter-spacing: 2px;\n  margin-bottom: 5px;\n  text-transform: uppercase;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   .header-text[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 2px 0 0 0;\n  font-size: 1.8rem;\n  letter-spacing: 1px;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%] {\n  overflow-y: auto;\n  scroll-behavior: smooth;\n  padding-right: 15px;\n  margin-right: -5px;\n  flex: 1;\n  min-height: 0;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 2px;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: rgba(0, 243, 255, 0.3);\n  border-radius: 2px;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.7);\n  font-size: 1rem;\n  line-height: 1.8;\n  letter-spacing: 0.2px;\n  font-weight: 300;\n  margin: 0;\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .sub-item-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 20px;\n  margin-top: 10px;\n}\n@media (max-width: 600px) {\n  .modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .sub-item-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .glass-card[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.03);\n  border: 1px solid rgba(255, 255, 255, 0.05);\n  border-radius: 16px;\n  padding: 20px;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\n  position: relative;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .glass-card[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.08);\n  border-color: rgba(0, 243, 255, 0.3);\n  transform: translateY(-3px);\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .glass-card[_ngcontent-%COMP%]:hover   .card-icon[_ngcontent-%COMP%] {\n  transform: scale(1.1) rotate(5deg);\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .glass-card[_ngcontent-%COMP%]:hover   .enter-symbol[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: translateX(0);\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .glass-card[_ngcontent-%COMP%]   .card-icon[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  transition: transform 0.4s ease;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .glass-card[_ngcontent-%COMP%]   .card-content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 5px 0;\n  font-size: 1.1rem;\n  color: white;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .glass-card[_ngcontent-%COMP%]   .card-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: rgba(255, 255, 255, 0.5);\n  line-height: 1.5;\n  margin: 0;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .glass-card[_ngcontent-%COMP%]   .enter-symbol[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 15px;\n  right: 15px;\n  font-size: 1.2rem;\n  color: #00f3ff;\n  opacity: 0;\n  transform: translateX(-10px);\n  transition: all 0.3s ease;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .detail-view[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.5s ease-out;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-footer[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  text-align: center;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-footer[_ngcontent-%COMP%]   .galactic-line[_ngcontent-%COMP%] {\n  height: 1px;\n  background:\n    linear-gradient(\n      to right,\n      transparent,\n      rgba(0, 243, 255, 0.3),\n      transparent);\n  margin-bottom: 15px;\n}\n.modal-content[_ngcontent-%COMP%]   .modal-footer[_ngcontent-%COMP%]   .footer-note[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  text-transform: uppercase;\n  color: rgba(255, 255, 255, 0.3);\n  letter-spacing: 4px;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_modalSlideUp {\n  from {\n    opacity: 0;\n    transform: translateY(40px) scale(0.95);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0% {\n    transform: scale(1);\n    opacity: 1;\n  }\n  50% {\n    transform: scale(1.3);\n    opacity: 0.7;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n@media (max-width: 768px) {\n  .modal-content[_ngcontent-%COMP%]   .discovery-hint[_ngcontent-%COMP%] {\n    opacity: 0.8 !important;\n  }\n  .modal-content[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%] {\n    padding: 30px;\n  }\n  .modal-content[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    text-align: center;\n    gap: 15px;\n  }\n  .modal-content[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%]   .header-text[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1.8rem;\n  }\n}\n@keyframes _ngcontent-%COMP%_fadeInDown {\n  from {\n    opacity: 0;\n    transform: translateY(-30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_floatIn {\n  from {\n    opacity: 0;\n    transform: translateY(50px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=about.component.css.map */"], data: { animation: [
    trigger("pageAnimations", [
      transition(":leave", [
        query(".event-row", [
          animate("320ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({
            transform: "translateY(16px)",
            opacity: 0
          }))
        ], { optional: true })
      ])
    ])
  ] }, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AboutComponent, [{
    type: Component,
    args: [{ selector: "app-about", standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, animations: [
      trigger("pageAnimations", [
        transition(":leave", [
          query(".event-row", [
            animate("320ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({
              transform: "translateY(16px)",
              opacity: 0
            }))
          ], { optional: true })
        ])
      ])
    ], template: '<section class="about-container" #container [class.modal-open]="isModalOpen">\r\n\r\n  <div class="timeline">\r\n    <div class="center-line"></div>\r\n\r\n    <div class="event-row" *ngFor="let item of timeline; let i = index" [class.left]="i % 2 === 0"\r\n      [class.right]="i % 2 !== 0">\r\n      <div class="dot-column">\r\n        <div class="dot">\r\n          <span>{{ item.icon }}</span>\r\n        </div>\r\n      </div>\r\n\r\n      <div class="content-card" (click)="openModal(item)">\r\n        <span class="year">{{ item.year }}</span>\r\n        <h3>{{ item.title }}</h3>\r\n        <div class="description-wrapper">\r\n          <p class="truncate-text">{{ item.desc }}</p>\r\n          <span class="discovery-hint">\r\n            <span class="hint-symbol">\u2192</span>\r\n          </span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- Perspective Modal Overlay -->\r\n  <div class="modal-overlay" *ngIf="isModalOpen" (click)="closeModal()">\r\n    <div class="modal-content" (click)="$event.stopPropagation()">\r\n      <button class="close-btn" (click)="closeModal()">&times;</button>\r\n\r\n      <div class="modal-header">\r\n        <!-- Back Button for Nested View -->\r\n        <button class="back-btn" *ngIf="selectedSubItem" (click)="closeSubItem()">\r\n          \u2190 Back\r\n        </button>\r\n\r\n        <div class="header-icon-container">\r\n          <span class="modal-icon">{{ selectedSubItem ? selectedSubItem.icon : selectedItem?.icon }}</span>\r\n        </div>\r\n        <div class="header-text">\r\n          <span class="modal-year" *ngIf="!selectedSubItem">{{ selectedItem?.year }}</span>\r\n          <span class="modal-category" *ngIf="selectedSubItem">{{ selectedItem?.title }}</span>\r\n          <h2>{{ selectedSubItem ? selectedSubItem.title : selectedItem?.title }}</h2>\r\n        </div>\r\n      </div>\r\n\r\n      <div class="modal-body" data-lenis-prevent>\r\n        <!-- 1. Standard View (No Sub-items) -->\r\n        <p class="main-text" *ngIf="!selectedItem?.subItems">{{ selectedItem?.fullDesc }}</p>\r\n\r\n        <!-- 2. Menu View (Sub-items List) -->\r\n        <div class="sub-item-grid" *ngIf="selectedItem?.subItems && !selectedSubItem">\r\n          <div class="glass-card" *ngFor="let sub of selectedItem.subItems" (click)="openSubItem(sub)">\r\n            <div class="card-icon">{{ sub.icon }}</div>\r\n            <div class="card-content">\r\n              <h3>{{ sub.title }}</h3>\r\n              <p>{{ sub.desc }}</p>\r\n            </div>\r\n            <div class="enter-symbol">\u2192</div>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- 3. Detail View (Selected Sub-item) -->\r\n        <div class="detail-view" *ngIf="selectedSubItem">\r\n          <p class="main-text">{{ selectedSubItem.fullDesc }}</p>\r\n        </div>\r\n      </div>\r\n\r\n      <div class="modal-footer">\r\n        <div class="galactic-line"></div>\r\n        <!-- <span class="footer-note">End of transmission</span> -->\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n</section>', styles: ["/* src/app/pages/about/about.component.scss */\n.about-container {\n  height: 100vh;\n  width: 100%;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding-top: 120px;\n  padding-bottom: 100px;\n  padding-left: 20px;\n  padding-right: 20px;\n  box-sizing: border-box;\n  color: white;\n  position: relative;\n  z-index: 10;\n  scroll-behavior: smooth;\n}\n@media (max-width: 768px) {\n  .about-container {\n    padding-left: 0;\n    padding-right: 40px;\n  }\n}\n.about-container::-webkit-scrollbar {\n  width: 6px;\n}\n.about-container::-webkit-scrollbar-track {\n  background: transparent;\n}\n.about-container::-webkit-scrollbar-thumb {\n  background: rgba(0, 243, 255, 0.2);\n  border-radius: 3px;\n}\n.about-container.modal-open {\n  overflow: hidden;\n  z-index: 9999;\n}\n.header {\n  text-align: center;\n  margin-bottom: 80px;\n  animation: fadeInDown 1s ease-out;\n}\n.header h1 {\n  font-size: 3rem;\n  font-weight: 700;\n  letter-spacing: 2px;\n  margin: 0;\n  text-transform: uppercase;\n  text-shadow: 0 0 20px rgba(0, 243, 255, 0.5);\n}\n.header .subtitle {\n  font-size: 1rem;\n  color: rgba(255, 255, 255, 0.6);\n  margin-top: 10px;\n  letter-spacing: 4px;\n  text-transform: uppercase;\n}\n.timeline {\n  position: relative;\n  max-width: 1000px;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n.center-line {\n  position: absolute;\n  left: 50%;\n  top: 50px;\n  bottom: 50px;\n  width: 2px;\n  background:\n    linear-gradient(\n      to bottom,\n      transparent,\n      #00f3ff,\n      transparent);\n  transform: translateX(-50%);\n  box-shadow: 0 0 15px #00f3ff;\n  opacity: 0.5;\n}\n@media (max-width: 768px) {\n  .center-line {\n    left: 42.5px;\n    transform: none;\n  }\n}\n.event-row {\n  display: grid;\n  grid-template-columns: 1fr 60px 1fr;\n  align-items: stretch;\n  width: 100%;\n  max-width: 1000px;\n  margin: 0 auto 10px auto;\n  gap: 10px;\n  position: relative;\n}\n@media (max-width: 768px) {\n  .event-row {\n    grid-template-columns: 45px 1fr;\n    margin-bottom: 25px;\n    gap: 15px;\n  }\n}\n.event-row .dot-column {\n  grid-column: 2;\n  grid-row: 1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n  z-index: 2;\n}\n@media (max-width: 768px) {\n  .event-row .dot-column {\n    grid-column: 1;\n  }\n}\n.event-row.left .content-card {\n  grid-column: 1;\n  grid-row: 1;\n  text-align: right;\n  justify-self: end;\n  align-self: center;\n  width: 100%;\n  max-width: 450px;\n}\n@media (max-width: 768px) {\n  .event-row.left .content-card {\n    grid-column: 2;\n    text-align: left;\n    justify-self: start;\n    max-width: 100%;\n  }\n}\n.event-row.right .content-card {\n  grid-column: 3;\n  grid-row: 1;\n  text-align: left;\n  justify-self: start;\n  align-self: center;\n  width: 100%;\n  max-width: 450px;\n}\n@media (max-width: 768px) {\n  .event-row.right .content-card {\n    grid-column: 2;\n    max-width: 100%;\n  }\n}\n.dot {\n  width: 55px;\n  height: 55px;\n  background: rgba(10, 10, 10, 0.9);\n  border: 1px solid rgba(0, 243, 255, 0.4);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.6rem;\n  z-index: 2;\n  box-shadow: 0 0 20px rgba(0, 243, 255, 0.2), inset 0 0 10px rgba(0, 243, 255, 0.1);\n  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n  flex-shrink: 0;\n}\n@media (max-width: 768px) {\n  .dot {\n    width: 45px;\n    height: 45px;\n    font-size: 1.3rem;\n  }\n}\n.dot:hover {\n  transform: scale(1.15) rotate(5deg);\n  border-color: #00f3ff;\n  box-shadow: 0 0 30px rgba(0, 243, 255, 0.5);\n  background: rgba(0, 243, 255, 0.05);\n}\n.content-card {\n  width: 100%;\n  max-width: 450px;\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  padding: 25px;\n  border-radius: 15px;\n  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n  cursor: pointer;\n  position: relative;\n  overflow: hidden;\n  z-index: 5;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n@media (max-width: 768px) {\n  .content-card {\n    max-width: 100%;\n    padding: 20px;\n  }\n}\n.content-card h3 {\n  margin: 0 0 10px 0;\n  font-size: 1.5rem;\n}\n.content-card .year {\n  display: block;\n  font-size: 0.8rem;\n  color: #00f3ff;\n  margin-bottom: 5px;\n  font-weight: 500;\n}\n.content-card:hover {\n  background: rgba(255, 255, 255, 0.08);\n  transform: translateY(-8px) scale(1.02);\n  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 243, 255, 0.1);\n  border-color: rgba(0, 243, 255, 0.3);\n}\n.content-card:hover .discovery-hint {\n  opacity: 1;\n  transform: translateX(3px);\n}\n.content-card .description-wrapper {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  margin-top: 10px;\n}\n.content-card p.truncate-text {\n  margin: 0;\n  font-size: 1rem;\n  color: #ccc;\n  line-height: 1.6;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  flex-grow: 1;\n}\n.content-card .discovery-hint {\n  display: flex;\n  align-items: center;\n  opacity: 0.5;\n  transition: all 0.3s ease;\n  flex-shrink: 0;\n}\n.content-card .discovery-hint .hint-symbol {\n  font-size: 1rem;\n  color: #00f3ff;\n  text-shadow: 0 0 10px #00f3ff;\n}\n.modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.1);\n  backdrop-filter: blur(8px);\n  z-index: 2000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  animation: fadeIn 0.4s ease-out;\n}\n@media (max-width: 768px) {\n  .modal-overlay {\n    padding-left: 0;\n    padding-right: 45px;\n  }\n}\n.modal-content {\n  width: 100%;\n  max-width: 700px;\n  max-height: 80vh;\n  background: rgba(15, 15, 15, 0.25);\n  backdrop-filter: blur(40px) saturate(200%);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 24px;\n  padding: 30px;\n  position: relative;\n  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(255, 255, 255, 0.05);\n  display: flex;\n  flex-direction: column;\n  animation: modalSlideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n  overflow: hidden;\n}\n@media (max-width: 768px) {\n  .modal-content {\n    padding: 20px;\n    padding-right: 25px;\n  }\n}\n.modal-content .close-btn {\n  position: absolute;\n  top: 15px;\n  right: 15px;\n  background: transparent;\n  border: none;\n  color: rgba(255, 255, 255, 0.6);\n  font-size: 1.8rem;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  line-height: 1;\n  z-index: 10000;\n  width: 44px;\n  height: 44px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n}\n.modal-content .close-btn:hover {\n  color: #00f3ff;\n  background: rgba(0, 243, 255, 0.1);\n  transform: rotate(90deg) scale(1.1);\n  box-shadow: 0 0 15px rgba(0, 243, 255, 0.2);\n}\n.modal-content .close-btn:active {\n  transform: scale(0.9);\n  background: rgba(255, 255, 255, 0.2);\n}\n.modal-content .modal-header {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 25px;\n  margin-bottom: 30px;\n}\n.modal-content .modal-header .back-btn {\n  background: none;\n  border: none;\n  color: #00f3ff;\n  font-size: 0.9rem;\n  font-weight: 600;\n  cursor: pointer;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  transition: all 0.3s;\n  opacity: 0;\n  animation: fadeIn 0.4s ease-out forwards 0.2s;\n  margin-right: 10px;\n}\n.modal-content .modal-header .back-btn:hover {\n  letter-spacing: 2px;\n  text-shadow: 0 0 10px rgba(0, 243, 255, 0.4);\n}\n.modal-content .modal-header .header-icon-container {\n  width: 60px;\n  height: 60px;\n  background: rgba(0, 243, 255, 0.1);\n  border: 1px solid rgba(0, 243, 255, 0.3);\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 2.2rem;\n  box-shadow: inset 0 0 20px rgba(0, 243, 255, 0.1);\n}\n.modal-content .modal-header .header-text .modal-year {\n  display: block;\n  color: #00f3ff;\n  font-size: 0.9rem;\n  letter-spacing: 2px;\n  margin-bottom: 5px;\n  font-weight: 600;\n}\n.modal-content .modal-header .header-text .modal-category {\n  display: block;\n  color: rgba(255, 255, 255, 0.5);\n  font-size: 0.8rem;\n  letter-spacing: 2px;\n  margin-bottom: 5px;\n  text-transform: uppercase;\n}\n.modal-content .modal-header .header-text h2 {\n  margin: 2px 0 0 0;\n  font-size: 1.8rem;\n  letter-spacing: 1px;\n}\n.modal-content .modal-body {\n  overflow-y: auto;\n  scroll-behavior: smooth;\n  padding-right: 15px;\n  margin-right: -5px;\n  flex: 1;\n  min-height: 0;\n}\n.modal-content .modal-body::-webkit-scrollbar {\n  width: 4px;\n}\n.modal-content .modal-body::-webkit-scrollbar-track {\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 2px;\n}\n.modal-content .modal-body::-webkit-scrollbar-thumb {\n  background: rgba(0, 243, 255, 0.3);\n  border-radius: 2px;\n}\n.modal-content .modal-body p {\n  color: rgba(255, 255, 255, 0.7);\n  font-size: 1rem;\n  line-height: 1.8;\n  letter-spacing: 0.2px;\n  font-weight: 300;\n  margin: 0;\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n.modal-content .modal-body .sub-item-grid {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 20px;\n  margin-top: 10px;\n}\n@media (max-width: 600px) {\n  .modal-content .modal-body .sub-item-grid {\n    grid-template-columns: 1fr;\n  }\n}\n.modal-content .modal-body .glass-card {\n  background: rgba(255, 255, 255, 0.03);\n  border: 1px solid rgba(255, 255, 255, 0.05);\n  border-radius: 16px;\n  padding: 20px;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\n  position: relative;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.modal-content .modal-body .glass-card:hover {\n  background: rgba(255, 255, 255, 0.08);\n  border-color: rgba(0, 243, 255, 0.3);\n  transform: translateY(-3px);\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);\n}\n.modal-content .modal-body .glass-card:hover .card-icon {\n  transform: scale(1.1) rotate(5deg);\n}\n.modal-content .modal-body .glass-card:hover .enter-symbol {\n  opacity: 1;\n  transform: translateX(0);\n}\n.modal-content .modal-body .glass-card .card-icon {\n  font-size: 2rem;\n  transition: transform 0.4s ease;\n}\n.modal-content .modal-body .glass-card .card-content h3 {\n  margin: 0 0 5px 0;\n  font-size: 1.1rem;\n  color: white;\n}\n.modal-content .modal-body .glass-card .card-content p {\n  font-size: 0.85rem;\n  color: rgba(255, 255, 255, 0.5);\n  line-height: 1.5;\n  margin: 0;\n}\n.modal-content .modal-body .glass-card .enter-symbol {\n  position: absolute;\n  top: 15px;\n  right: 15px;\n  font-size: 1.2rem;\n  color: #00f3ff;\n  opacity: 0;\n  transform: translateX(-10px);\n  transition: all 0.3s ease;\n}\n.modal-content .modal-body .detail-view {\n  animation: fadeIn 0.5s ease-out;\n}\n.modal-content .modal-footer {\n  margin-top: 20px;\n  text-align: center;\n}\n.modal-content .modal-footer .galactic-line {\n  height: 1px;\n  background:\n    linear-gradient(\n      to right,\n      transparent,\n      rgba(0, 243, 255, 0.3),\n      transparent);\n  margin-bottom: 15px;\n}\n.modal-content .modal-footer .footer-note {\n  font-size: 0.7rem;\n  text-transform: uppercase;\n  color: rgba(255, 255, 255, 0.3);\n  letter-spacing: 4px;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes modalSlideUp {\n  from {\n    opacity: 0;\n    transform: translateY(40px) scale(0.95);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n@keyframes pulse {\n  0% {\n    transform: scale(1);\n    opacity: 1;\n  }\n  50% {\n    transform: scale(1.3);\n    opacity: 0.7;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n@media (max-width: 768px) {\n  .modal-content .discovery-hint {\n    opacity: 0.8 !important;\n  }\n  .modal-content .modal-content {\n    padding: 30px;\n  }\n  .modal-content .modal-content .modal-header {\n    flex-direction: column;\n    text-align: center;\n    gap: 15px;\n  }\n  .modal-content .modal-content .header-text h2 {\n    font-size: 1.8rem;\n  }\n}\n@keyframes fadeInDown {\n  from {\n    opacity: 0;\n    transform: translateY(-30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes floatIn {\n  from {\n    opacity: 0;\n    transform: translateY(50px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=about.component.css.map */\n"] }]
  }], null, { containerRef: [{
    type: ViewChild,
    args: ["container"]
  }], onEscapeKeydown: [{
    type: HostListener,
    args: ["document:keydown.escape"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AboutComponent, { className: "AboutComponent", filePath: "src/app/pages/about/about.component.ts", lineNumber: 35 });
})();
export {
  AboutComponent
};
//# sourceMappingURL=chunk-BQCERJRH.js.map
