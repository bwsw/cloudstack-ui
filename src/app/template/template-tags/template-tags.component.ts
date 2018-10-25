import { Component, Input } from '@angular/core';
import { Tag } from '../../shared/models';
import { TagsComponent } from '../../tags/tags.component';
import { BaseTemplateModel, resourceType } from '../shared';
import { AuthService } from '../../shared/services/auth.service';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { TagService } from '../../shared/services/tags/tag.service';
import { KeyValuePair } from '../../tags/tags-view/tags-view.component';

@Component({
  selector: 'cs-template-tags',
  templateUrl: 'template-tags.component.html',
})
export class TemplateTagsComponent extends TagsComponent {
  @Input()
  public entity: BaseTemplateModel;
  @Input()
  public tags: Tag[];

  public get hasPermissions(): boolean {
    return this.entity.account === this.authService.user.account || this.authService.isAdmin();
  }

  constructor(
    protected dialogService: DialogService,
    protected tagService: TagService,
    protected authService: AuthService,
  ) {
    super(dialogService, tagService);
  }

  public addTag(tag: KeyValuePair): void {
    if (!tag) {
      return;
    }

    this.tagService
      .create({
        resourceIds: this.entity.id,
        resourceType: resourceType(this.entity),
        'tags[0].key': tag.key,
        'tags[0].value': tag.value,
      })
      .subscribe(res => this.tagAdded.emit(tag), error => this.onError(error));
  }
}
