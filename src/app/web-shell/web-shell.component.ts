import { Component, Input } from '@angular/core';
import { WebShellService } from './web-shell.service';
import { VirtualMachine } from '../vm/shared/vm.model';


@Component({
  selector: 'cs-web-shell',
  templateUrl: 'web-shell.component.html'
})
export class WebShellComponent {
  @Input() public disabled: boolean;
  @Input() private vm: VirtualMachine;

  constructor(private webShellService: WebShellService) {}

  public onActivate(): void {
    this.webShellService
      .getWebShellAddress(this.vm)
      .subscribe(address => {
        window.open(address);
      });
  }
}
