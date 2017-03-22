import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'cs-time-picker',
  templateUrl: 'time-picker.component.html',
  styleUrls: ['time-picker.component.scss']
})
export class TimePickerComponent {
  @Input() public locale: string;
  public format: 12 | 24;

  constructor(private translateService: TranslateService) {}

  public ngOnInit(): void {
    this.format = this.getTimeFormat(this.locale);
  }

  // todo: generalize
  public get minutesErrorMessage(): Observable<string> {
    return this.translateService.get('BETWEEN', {
      lowerLimit: 0,
      upperLimit: 59
    });
  }

  public get hoursErrorMessage(): Observable<string> {
    return this.translateService.get('BETWEEN', {
      lowerLimit: 0,
      upperLimit: this.format - 1
    });
  }

  private getTimeFormat(locale: string): 12 | 24 {
    if (locale === 'ru') {
      return 24;
    }
    return 12;
  }
}
