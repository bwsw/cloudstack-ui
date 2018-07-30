import { Component } from '@angular/core';
import { BaseTemplateDetailsComponent } from './details.component';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'cs-iso-details',
  templateUrl: './details.component.html',
styleUrls: ['./details.component.scss']
})
export class IsoDetailsComponent extends BaseTemplateDetailsComponent {
  constructor(notificationService: SnackBarService) {
    super(notificationService);
  }
}
