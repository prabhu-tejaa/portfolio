import { Component } from '@angular/core';
import { LoaderTransitionComponent } from './loader-transition/loader-transition.component';
@Component({
  selector: 'app-root',
  imports: [LoaderTransitionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'portifolio';

}
