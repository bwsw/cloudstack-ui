import { Component } from '@angular/core';
import { BaseTemplateDetailsComponent } from './details.component';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'cs-template-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class TemplateDetailsComponent extends BaseTemplateDetailsComponent {
  constructor(notificationService: SnackBarService) {
    super(notificationService);
  }
}
