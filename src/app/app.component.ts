import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  ResolveStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@angular/router';
import { SpinnerService } from './app-modules/core/services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (
        event instanceof ResolveStart ||
        event instanceof RouteConfigLoadStart
      ) {
        this.spinnerService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof RouteConfigLoadEnd
      ) {
        setTimeout(() => this.spinnerService.hide(), 500);
      } else if (event instanceof NavigationError) {
        setTimeout(() => this.spinnerService.hide(), 500);
      } else if (event instanceof NavigationCancel) {
        setTimeout(() => this.spinnerService.hide(), 500);
      }
    });
  }
}
