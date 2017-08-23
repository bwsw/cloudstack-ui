import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MdSelectChange } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Color } from '../shared/models/color.model';
import { AuthService } from '../shared/services/auth.service';

import { LanguageService, TimeFormat } from '../shared/services/language.service';
import { NotificationService } from '../shared/services/notification.service';
import { StyleService } from '../shared/services/style.service';
import { UserService } from '../shared/services/user.service';
import { WithUnsubscribe } from '../utils/mixins/with-unsubscribe';


@Component({
  selector: 'cs-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent extends WithUnsubscribe() implements OnInit {
  public userId: string;
  public accentColor: Color;
  public firstDayOfWeek = 1;
  public language: string;
  public primaryColor: Color;
  public primaryColors: Array<Color>;
  public timeFormat: string = TimeFormat.AUTO;

  public passwordUpdateForm: FormGroup;

  public updatingFirstDayOfWeek = false;
  public updatingTimeFormat = false;
  public dayTranslations: {};
  public loading = false;

  public primaryColorControl = new FormControl();
  public accentColorControl = new FormControl();

  public languages = [
    { value: 'en', text: 'English' },
    { value: 'ru', text: 'Русский' }
  ];

  public daysOfTheWeek = [
    { value: 0, text: 'DATE_TIME.DAYS_OF_WEEK.SUNDAY' },
    { value: 1, text: 'DATE_TIME.DAYS_OF_WEEK.MONDAY' }
  ];

  public TimeFormat = TimeFormat;
  public timeFormats = Object.keys(TimeFormat);

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private languageService: LanguageService,
    private notificationService: NotificationService,
    private styleService: StyleService,
    private translateService: TranslateService,
    private userService: UserService
  ) {
    super();
    this.userId = this.authService.userId;
  }

  public ngOnInit(): void {
    this.getLanguage();
    this.loadColors();
    this.loadFirstDayOfWeek();
    this.buildForm();
    this.loadDayTranslations();
    this.loadTimeFormat();
    this.translateService.onLangChange
      .takeUntil(this.unsubscribe$)
      .subscribe(() => this.loadDayTranslations());
  }

  public get accentColors(): Array<Color> {
    return this.primaryColors.filter(color => color.name !== this.primaryColor.name && !color.primaryOnly);
  }

  public getTimeFormatTranslationToken(format: TimeFormat): string {
    const timeFormatTranslations = {
      'hour12': 'SETTINGS.LOOK_AND_FEEL.hour12',
      'hour24': 'SETTINGS.LOOK_AND_FEEL.hour24',
      'AUTO': 'SETTINGS.LOOK_AND_FEEL.AUTO'
    };

    return timeFormatTranslations[format];
  }

  private get firstAvailableAccentColor(): Color {
    try {
      return this.primaryColor !== this.accentColors[0] ? this.accentColors[0] : this.accentColors[1];
    } catch (e) {
      throw new Error('Incorrect color configuration');
    }
  }

  public changeLanguage(change: MdSelectChange): void {
    this.loading = true;
    this.languageService.setLanguage(change.value);
    this.loadDayTranslations();
  }

  public changeTimeFormat(change: MdSelectChange): void {
    this.updatingTimeFormat = true;
    this.languageService.setTimeFormat(change.value)
      .finally(() => this.updatingTimeFormat = false)
      .subscribe();
  }

  public updatePrimaryColor(color: Color): void {
    this.primaryColor = color;
    if (this.primaryColor.value === this.accentColor.value) {
      this.accentColor = this.firstAvailableAccentColor;
    }

    this.updatePalette();
  }

  public updateAccentColor(color: Color): void {
    this.accentColor = color;
    this.updatePalette();
  }

  public updatePalette(): void {
    this.styleService.setPalette(this.primaryColor, this.accentColor);
  }

  public updatePassword(): void {
    this.userService.updatePassword(this.authService.userId, this.password)
      .subscribe(
        () => this.notificationService.message('SETTINGS.SECURITY.PASSWORD_CHANGED_SUCCESSFULLY'),
        error => this.notificationService.error(error.errortext)
      );
    this.passwordUpdateForm.reset();
  }

  public firstDayOfWeekChange(change: MdSelectChange): void {
    this.firstDayOfWeek = change.value;
    this.updatingFirstDayOfWeek = true;
    this.languageService.setFirstDayOfWeek(change.value)
      .finally(() => this.updatingFirstDayOfWeek = false)
      .subscribe();
  }

  private get password(): string {
    return this.passwordUpdateForm.controls['password'].value;
  }

  private loadDayTranslations(): void {
    this.translateService.get(['DATE_TIME.DAYS_OF_WEEK.SUNDAY', 'DATE_TIME.DAYS_OF_WEEK.MONDAY'])
      .subscribe(translations => {
        // workaround for queryList change bug (https://git.io/v9R69)
        this.dayTranslations = undefined;
        setTimeout(() => {
          this.dayTranslations = translations;
          setTimeout(() => this.loading = false, 500);
        }, 0);
      });
  }

  private getLanguage(): void {
    this.languageService.getLanguage().subscribe(language => this.language = language);
  }

  private loadColors(): void {
    this.styleService.getThemeData()
      .subscribe(themeData => {
        this.primaryColors = themeData.themeColors;
        this.primaryColor = themeData.themeColors.find(color => color.name === themeData.primaryColor) ||
          themeData.themeColors[0];
        this.accentColor = this.accentColors.find(color => color.name === themeData.accentColor) ||
          themeData.themeColors[1];

        this.primaryColorControl.setValue(this.primaryColor);
        this.accentColorControl.setValue(this.accentColor);
      });
  }

  private loadFirstDayOfWeek(): void {
    this.languageService.getFirstDayOfWeek()
      .subscribe((day: number) => this.firstDayOfWeek = day);
  }

  private loadTimeFormat(): void {
    this.languageService.getTimeFormat()
      .subscribe(timeFormat => this.timeFormat = timeFormat);
  }

  private buildForm(): void {
    this.passwordUpdateForm = this.formBuilder.group({
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required]
    }, { validator: this.passwordsNotEqual });
  }

  private passwordsNotEqual(formGroup: FormGroup): { passwordsNotEqual: true } | null {
    const valid = formGroup.controls['password'].value === formGroup.controls['passwordRepeat'].value;
    return valid ? null : { passwordsNotEqual: true };
  }
}
