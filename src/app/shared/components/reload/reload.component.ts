import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'cs-reload',
  template: '',
})
export class ReloadComponent implements OnInit {
  constructor(private location: Location) {}

  public ngOnInit(): void {
    this.location.back();
  }
}
