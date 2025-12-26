import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  NgZone,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { GlobeEngineService } from './services/globe-engine.service';

@Component({
  selector: 'app-globe',
  standalone: true,
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss']
})
export class GlobeComponent implements AfterViewInit, OnDestroy {

  @Output() ready = new EventEmitter<void>();

  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private globeEngine: GlobeEngineService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.globeEngine.init(this.canvas.nativeElement, () => {
        this.ngZone.run(() => this.ready.emit());
      });
    });
  }

  ngOnDestroy() {
    this.globeEngine.destroy();
  }
}
