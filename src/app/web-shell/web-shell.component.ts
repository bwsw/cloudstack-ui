import { Component, Input } from '@angular/core';
import { WebShellService } from './web-shell.service';
import { VirtualMachine } from '../vm/shared/vm.model';
import { Router } from '@angular/router';


@Component({
  selector: 'cs-web-shell',
  templateUrl: 'web-shell.component.html'
})
export class WebShellComponent {
  @Input() private vm: VirtualMachine;

  constructor(
    private router: Router,
    private webShellService: WebShellService
  ) {}

  public onActivate(): void {
    this.webShellService
      .getWebShellAddress(this.vm)
      .subscribe(address => {
        window.open(address);
      });
  }
}
