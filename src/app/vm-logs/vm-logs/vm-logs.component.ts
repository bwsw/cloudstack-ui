import { Component } from '@angular/core';

@Component({
  selector: 'cs-vm-logs',
  templateUrl: 'vm-logs.component.html',
  styleUrls: ['vm-logs.component.scss']
})
export class VmLogsComponent {
  mode: 'follow' | 'stop' = 'stop';
  public newestFirst = false;

  public onFollow() {
    this.mode = 'follow';
  }

  public onStop() {
    this.mode = 'stop';
  }

  public onNewestFirstChange() {
    this.newestFirst = !this.newestFirst;
  }
}