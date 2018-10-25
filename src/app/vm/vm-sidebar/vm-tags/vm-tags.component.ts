import { Component, Input } from '@angular/core';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { TagService } from '../../../shared/services/tags/tag.service';
import { TagsComponent } from '../../../tags/tags.component';
import { VirtualMachine, vmResourceType } from '../../shared/vm.model';

@Component({
  selector: 'cs-vm-tags',
  templateUrl: 'vm-tags.component.html',
})
export class VmTagsComponent extends TagsComponent {
  @Input()
  public entity: VirtualMachine;
  public resourceType = vmResourceType;

  constructor(protected dialogService: DialogService, protected tagService: TagService) {
    super(dialogService, tagService);
  }
}
