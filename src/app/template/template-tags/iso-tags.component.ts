import { Component } from '@angular/core';
import { BaseTemplateTagsComponent } from './tags.component';
import { AuthService } from '../../shared/services/auth.service';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { TagService } from '../../shared/services/tags/tag.service';
import { IsoService } from '../shared/iso.service';


@Component({
  selector: 'cs-iso-tags',
  templateUrl: 'tags.component.html'
})
export class IsoTagsComponent extends BaseTemplateTagsComponent {
  constructor(
    service: IsoService,
    dialogService: DialogService,
    tagService: TagService,
    authService: AuthService
  ) {
    super(service, dialogService, tagService, authService);
  }
}
