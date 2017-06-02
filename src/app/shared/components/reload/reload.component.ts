import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'cs-reload',
  template: ''
})
export class ReloadComponent implements OnInit {
  constructor(private router: Router) {}

  public ngOnInit(): void {
    this.router.navigate([document.referrer]);
  }
}
