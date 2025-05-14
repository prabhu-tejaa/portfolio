import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader-transition',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './loader-transition.component.html',
  styleUrls: ['./loader-transition.component.scss']
})
export class LoaderTransitionComponent implements OnInit {
  showLoader = true;
  showMainContent = false;
  startFadeOut = false;

  ngOnInit() {
    setTimeout(() => {
      this.startFadeOut = true; // start fading out

      setTimeout(() => {
        this.showLoader = false;
        this.showMainContent = true; // show main content with fade-in
      }, 600); // wait 1s for fade-out animation to finish
    }, 1100); // wait 3s before starting fade-out
  }
}
