import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SettingsViewModel } from '../../view-models';

@Component({
  selector: 'cs-vm-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vm-settings.component.html',
  styleUrls: ['../../styles/settings-section.scss'],
})
export class VmSettingsComponent {
  @Input()
  settings: SettingsViewModel;
  @Output()
  keyboardLayoutChange = new EventEmitter<string>();
}
