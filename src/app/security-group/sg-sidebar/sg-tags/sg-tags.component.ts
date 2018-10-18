import { Component, Input } from '@angular/core';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { TagService } from '../../../shared/services/tags/tag.service';
import { TagsComponent } from '../../../tags/tags.component';
import { SecurityGroupNative } from '../../sg.model';

@Component({
  selector: 'cs-sg-tags',
  templateUrl: 'sg-tags.component.html',
})
export class SecurityGroupTagsComponent extends TagsComponent {
  @Input()
  public entity: SecurityGroupNative;
  public resourceType = 'SecurityGroup';

  constructor(protected dialogService: DialogService, protected tagService: TagService) {
    super(dialogService, tagService);
  }
}
