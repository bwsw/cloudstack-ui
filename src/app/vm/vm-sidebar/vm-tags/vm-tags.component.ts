import { Component, Input, OnChanges, } from '@angular/core';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { TagService } from '../../../shared/services/tags/tag.service';
import { TagsComponent } from '../../../tags/tags.component';
import { VirtualMachine } from '../../shared/vm.model';


@Component({
  selector: 'cs-vm-tags',
  templateUrl: 'vm-tags.component.html'
})
export class VmTagsComponent extends TagsComponent<VirtualMachine> implements OnChanges {
  @Input() public entity: VirtualMachine;

  constructor(
    protected dialogService: DialogService,
    protected tagService: TagService,
  ) {
    super(dialogService, tagService);
  }

  public ngOnChanges(): void {
    this.tags = this.entity && this.entity.tags;
  }

}
