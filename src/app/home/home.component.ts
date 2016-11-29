import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  public ngOnInit() {
    console.log('Hello Home');
  }

}
