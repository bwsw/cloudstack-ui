import { Component } from '@angular/core';
import { TagService } from '../../shared/services/tags/tag.service';
import { TemplateService } from '../shared';
import { BaseTemplateTagsComponent } from './tags.component';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'cs-template-tags',
  templateUrl: 'tags.component.html'
})
export class TemplateTagsComponent extends BaseTemplateTagsComponent {
  constructor(
    service: TemplateService,
    route: ActivatedRoute,
    dialogService: DialogService,
    tagService: TagService,
    authService: AuthService
  ) {
    super(service, route, dialogService, tagService, authService);
  }
}

