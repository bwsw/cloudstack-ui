import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Volume } from '../../../models';
import { VirtualMachine } from '../../../../vm/shared/vm.model';

@Component({
  selector: 'cs-volume-attachment',
  templateUrl: 'volume-attachment.component.html',
  styleUrls: ['volume-attachment.component.scss'],
})
export class VolumeAttachmentComponent implements OnInit {
  public virtualMachineId: string;
  @Input()
  public virtualMachines: VirtualMachine[];
  @Input()
  public volume: Volume;
  @Input()
  public zoneId: string;
  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  public onVirtualMachineId = new EventEmitter();

  public ngOnInit() {
    if (this.virtualMachines.length) {
      this.virtualMachineId = this.virtualMachines[0].id;
    }
  }

  public attach(): void {
    this.onVirtualMachineId.emit(this.virtualMachineId);
  }
}
