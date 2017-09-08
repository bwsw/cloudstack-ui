import { Component } from '@angular/core';
import { TagService } from '../../shared/services/tags/common/tag.service';
import { TemplateService } from '../shared';
import { BaseTemplateTagsComponent } from './tags.component';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../dialog/dialog-service/dialog.service';


@Component({
  selector: 'cs-template-tags',
  templateUrl: 'tags.component.html'
})
export class TemplateTagsComponent extends BaseTemplateTagsComponent {
  constructor(
    service: TemplateService,
    route: ActivatedRoute,
    dialogService: DialogService,
    tagService: TagService
  ) {
    super(service, route, dialogService, tagService);
  }
}

