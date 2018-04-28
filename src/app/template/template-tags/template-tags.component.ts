import { Component, Input } from '@angular/core';
import { Tag } from '../../shared/models';
import { TagsComponent } from '../../tags/tags.component';
import { BaseTemplateModel } from '../shared';
import { AuthService } from '../../shared/services/auth.service';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { TagService } from '../../shared/services/tags/tag.service';


@Component({
  selector: 'cs-template-tags',
  templateUrl: 'tags.component.html'
})
export class TemplateTagsComponent extends TagsComponent<BaseTemplateModel> {
  @Input() public entity: BaseTemplateModel;
  @Input() public tags: Array<Tag>;

  public get hasPermissions(): boolean {
    return this.entity.account === this.authService.user.account || this.authService.isAdmin();
  }

  constructor(
    protected dialogService: DialogService,
    protected tagService: TagService,
    protected authService: AuthService
  ) {
    super(dialogService, tagService);
  }
}

