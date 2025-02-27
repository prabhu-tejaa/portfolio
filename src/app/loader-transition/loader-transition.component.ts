import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-loader-transition',
  imports: [RouterModule, CommonModule],
  templateUrl: './loader-transition.component.html',
  styleUrls: ['./loader-transition.component.scss']
})
export class LoaderTransitionComponent implements OnInit {
  showLoader = true;
  showDesktopView = false;
  showMainContent = false;

  ngOnInit() {
    setTimeout(() => {
      this.showLoader = false;
      this.showDesktopView = true;

      this.showDesktopView = false;
      this.showMainContent = true; 
    }, 3000);
  }
}