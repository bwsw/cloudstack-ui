import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Tag } from '../../shared/models';
import { TagService } from '../../shared/services/tags/tag.service';
import { TagsComponent } from '../../tags/tags.component';
import { IsoService, TemplateService } from '../shared';
import { BaseTemplateModel } from '../shared/base-template.model';
import { BaseTemplateService } from '../shared/base-template.service';


@Component({
  selector: 'cs-template-tags',
  templateUrl: 'template-tags.component.html'
})
export class TemplateTagsComponent extends TagsComponent<BaseTemplateModel> {
  @Input() public entity: BaseTemplateModel;

  constructor(
    protected dialogService: DialogService,
    protected tagService: TagService,
    private templateService: TemplateService,
    private isoService: IsoService
  ) {
    super(dialogService, tagService);
  }

  protected get entityTags(): Observable<Array<Tag>> {
    let service: BaseTemplateService;

    if (this.entity.isTemplate) {
      service = this.templateService;
    } else {
      service = this.isoService;
    }

    service.invalidateCache();
    return service.get(this.entity.id).map(_ => _.tags);
  }
}
