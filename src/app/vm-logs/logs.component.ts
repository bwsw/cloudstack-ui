import { Component } from '@angular/core';

@Component({
  selector: 'cs-logs',
  templateUrl: 'logs.component.html',
  styleUrls: ['logs.component.scss']
})
export class LogsComponent {
  mode: 'follow' | 'stop' = 'stop';
  public newestFirst = false;

  onFollow() {
    this.mode = 'follow';
  }

  onStop() {
    this.mode = 'stop';
  }

  public onNewestFirstChange() {
    this.newestFirst = !this.newestFirst;
  }
}
