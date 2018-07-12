import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SettingsViewModel } from '../../view-models';

@Component({
  selector: 'cs-security-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss']
})

export class SecuritySettingsComponent {
  @Input() settings: SettingsViewModel;
  @Output() updatePassword = new EventEmitter<string>();
  @Output() settingsChange = new EventEmitter<SettingsViewModel>();

  public onUpdateSessionTimeout(sessionTimeout: number) {
    this.settingsChange.emit({
      ...this.settings,
      sessionTimeout
    });
  }

  public onSavePasswordsForVMs(value: boolean) {
    this.settingsChange.emit({
      ...this.settings,
      isSavePasswordForVMs: value
    });
  }
}
