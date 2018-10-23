import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { SettingsViewModel } from '../../view-models';

@Component({
  selector: 'cs-security-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss', '../../styles/settings-section.scss'],
})
export class SecuritySettingsComponent {
  @Input()
  settings: SettingsViewModel;
  @Output()
  passwordChange = new EventEmitter<string>();
  @Output()
  sessionTimeoutChange = new EventEmitter<number>();
  @Output()
  isSavePasswordForVMsChange = new EventEmitter<boolean>();
}
