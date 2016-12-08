import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';

@Component({
  selector: 'cs-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private cookie: CookieService) {
    // Do stuff
  }

  public ngOnInit() {
    console.log('Hello About');
    console.log(this.cookie.getAll());
  }
}
