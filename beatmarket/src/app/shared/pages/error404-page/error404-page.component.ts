import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error404-page',
  templateUrl: './error404-page.component.html',
  styleUrls: ['./error404-page.component.scss'],
})
export class Error404PageComponent { constructor(private location: Location, private router: Router) {}

  goBack(): void {
    this.location.back();
  }

  goInit(): void {
    this.router.navigate(['/']);
  }
}
