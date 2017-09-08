import { Component } from '@angular/core';
import { TagService } from '../../shared/services/tags/common/tag.service';
import { BaseTemplateTagsComponent } from './tags.component';
import { ActivatedRoute } from '@angular/router';
import { IsoService } from '../shared/iso/iso.service';
import { DialogService } from '../../dialog/dialog-service/dialog.service';


@Component({
  selector: 'cs-template-tags',
  templateUrl: 'tags.component.html'
})
export class IsoTagsComponent extends BaseTemplateTagsComponent {
  constructor(
    service: IsoService,
    route: ActivatedRoute,
    dialogService: DialogService,
    tagService: TagService
  ) {
    super(service, route, dialogService, tagService);
  }
}
