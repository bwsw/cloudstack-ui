import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { themes as themesList } from '../../../shared/services/style.service';
import { SettingsViewModel } from '../../view-models';
import { DayOfWeek, Language, TimeFormat } from '../../../shared/types';


@Component({
  selector: 'cs-interface-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './interface-settings.component.html',
  styleUrls: ['./interface-settings.component.scss']
})

export class InterfaceSettingsComponent {
  @Input() settings: SettingsViewModel;
  @Output() settingsChange = new EventEmitter<SettingsViewModel>();

  public languages = [
    { value: Language.en, text: 'English' },
    { value: Language.ru, text: 'Русский' }
  ];
  public daysOfTheWeek = [
    { value: DayOfWeek.Sunday, text: 'DATE_TIME.DAYS_OF_WEEK.SUNDAY' },
    { value: DayOfWeek.Monday, text: 'DATE_TIME.DAYS_OF_WEEK.MONDAY' }
  ];
  public timeFormats = [
    { value: TimeFormat.AUTO, text: 'SETTINGS.LOOK_AND_FEEL.AUTO' },
    { value: TimeFormat.hour12, text: 'SETTINGS.LOOK_AND_FEEL.hour12' },
    { value: TimeFormat.hour24, text: 'SETTINGS.LOOK_AND_FEEL.hour24' },
  ];
  public themes = themesList;

  public onChange(value: string, settingName: string) {
    this.settingsChange.emit({
      ...this.settings,
      [settingName]: value
    });
  }

}
