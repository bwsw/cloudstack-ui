import { Component } from '@angular/core';
import { TagService } from '../../shared/services/tags/tag.service';
import { BaseTemplateTagsComponent } from './tags.component';
import { ActivatedRoute } from '@angular/router';
import { IsoService } from '../shared/iso.service';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'cs-template-tags',
  templateUrl: 'tags.component.html'
})
export class IsoTagsComponent extends BaseTemplateTagsComponent {
  constructor(
    service: IsoService,
    route: ActivatedRoute,
    dialogService: DialogService,
    tagService: TagService,
    authService: AuthService
  ) {
    super(service, route, dialogService, tagService, authService);
  }
}
