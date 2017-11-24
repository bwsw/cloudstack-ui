import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { Volume } from '../../../models';
import { VirtualMachine } from '../../../../vm/shared/vm.model';


@Component({
  selector: 'cs-volume-attachment',
  templateUrl: 'volume-attachment.component.html',
  styleUrls: ['volume-attachment.component.scss']
})
export class VolumeAttachmentComponent {
  public virtualMachineId: string;
  @Input() public virtualMachines: Array<VirtualMachine>;
  @Input() public volume: Volume;
  @Input() public zoneId: string;
  @Output() public onVirtualMachineId = new EventEmitter();


  public attach(): void {
    this.onVirtualMachineId.emit(this.virtualMachineId);
  }
}
