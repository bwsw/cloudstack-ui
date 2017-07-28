import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { Tag } from '../../shared/models';
import { TagService } from '../../shared/services';
import { TagsComponent } from '../../tags/tags.component';
import { VmService } from '../shared/vm.service';
import { VirtualMachine } from '../shared/vm.model';


@Component({
  selector: 'cs-vm-tags',
  templateUrl: 'vm-tags.component.html'
})
export class VmTagsComponent extends TagsComponent {
  @Input() public entity: VirtualMachine;

  constructor(
    protected dialogService: DialogService,
    protected tagService: TagService,
    private vmService: VmService
  ) {
    super(dialogService, tagService);
  }

  protected get entityTags(): Observable<Array<Tag>> {
    return this.vmService.get(this.entity.id).map(_ => _.tags);
  }
}
