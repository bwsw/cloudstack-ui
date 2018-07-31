import { BaseTemplateModel } from '../../shared/base-template.model';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { Input } from '@angular/core';
import moment = require('moment');
import { downloadUrl } from '../../shared';


export abstract class BaseTemplateDetailsComponent {
  @Input() public entity: BaseTemplateModel;

  constructor(private notificationService: SnackBarService) {
  }

  public get templateTypeTranslationToken(): string {
    const type = this.entity && (this.entity as any).type || '';
    const templateTypeTranslations = {
      'BUILTIN': 'Built-in',
      'USER': 'User'
    };

    return templateTypeTranslations[type];
  }

  public get entityCreated(): Date {
    return moment(this.entity.created).toDate();
  }

  public get getDownloadUrl() {
    return downloadUrl(this.entity);
  }

  public onCopySuccess(): void {
    this.notificationService.open('CLIPBOARD.COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.open('CLIPBOARD.COPY_FAIL');
  }

}
