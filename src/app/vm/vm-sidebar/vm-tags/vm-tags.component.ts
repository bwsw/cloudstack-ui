import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Tag } from '../../../shared/models';
import { TagService } from '../../../shared/services/tags/tag.service';
import { TagsComponent } from '../../../tags/tags.component';
import { VirtualMachine } from '../../shared/vm.model';
import {
  KeyValuePair,
  TagEditAction
} from '../../../tags/tags-view/tags-view.component';


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
