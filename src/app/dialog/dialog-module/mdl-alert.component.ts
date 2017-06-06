import {
  Component,
  Input,
  Output,
  EventEmitter, HostBinding
} from '@angular/core';

import { MdlDialogService } from './mdl-dialog.service';


@Component({
  // tslint:disable-next-line
  selector: 'mdl-alert',
  template: ``,
  exportAs: 'mdlAlert'
})
export class MdlAlertComponent {
  @Input() public title: string;
  @Input() public message: string;
  @Input() public okText: string;
  @Output() public confirmed = new EventEmitter();
  @HostBinding('style.display') public display = 'none';

  constructor(private mdlDialogService: MdlDialogService) {}

  public show(): void {
    this.mdlDialogService
      .alert(this.message, this.okText, this.title)
      .subscribe(() => this.confirmed.emit());
  }
}
