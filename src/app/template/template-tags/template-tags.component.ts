import { Component } from '@angular/core';
import { BaseTemplateTagsComponent } from './tags.component';
import { AuthService } from '../../shared/services/auth.service';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { TagService } from '../../shared/services/tags/tag.service';
import { TemplateService } from '../shared/template.service';


@Component({
  selector: 'cs-template-tags',
  templateUrl: 'tags.component.html'
})
export class TemplateTagsComponent extends BaseTemplateTagsComponent {
  constructor(
    service: TemplateService,
    dialogService: DialogService,
    tagService: TagService,
    authService: AuthService
  ) {
    super(service, dialogService, tagService, authService);
  }
}

