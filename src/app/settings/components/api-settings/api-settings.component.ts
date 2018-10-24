import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiKeys } from '../../../shared/models/account-user.model';

@Component({
  selector: 'cs-api-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './api-settings.component.html',
  styleUrls: ['./api-settings.component.scss', '../../styles/settings-section.scss'],
})
export class ApiSettingsComponentComponent {
  @Input()
  userKeys: ApiKeys;
  @Input()
  apiUrl: string;
  @Input()
  apiDocumentationLink: string;
  @Output()
  regenerateKeys = new EventEmitter<boolean>();
}
