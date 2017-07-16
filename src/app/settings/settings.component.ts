import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Color, LanguageService, StyleService } from '../shared';
import { AuthService, NotificationService } from '../shared/services';
import { TimeFormat } from '../shared/services/language.service';
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
  public timeFormat: string | null = null;

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
    { value: 0, text: 'SUNDAY' },
    { value: 1, text: 'MONDAY' }
  ];

  public TimeFormat = TimeFormat;
  // TODO replace when TypeScript 2.4 string enums land
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

  private get firstAvailableAccentColor(): Color {
    try {
      return this.primaryColor !== this.accentColors[0] ? this.accentColors[0] : this.accentColors[1];
    } catch (e) {
      throw new Error('Incorrect color configuration');
    }
  }

  public changeLanguage(lang: string): void {
    this.loading = true;
    this.languageService.setLanguage(lang);
    this.loadDayTranslations();
  }

  public changeTimeFormat(timeFormat: string | null): void {
    this.updatingTimeFormat = true;
    this.languageService.setTimeFormat(timeFormat)
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
        () => this.notificationService.message('PASSWORD_CHANGED_SUCCESSFULLY'),
        error => this.notificationService.error(error.errortext)
      );
    this.passwordUpdateForm.reset();
  }

  public firstDayOfWeekChange(day: number): void {
    this.firstDayOfWeek = day;
    this.updatingFirstDayOfWeek = true;
    this.userService.writeTag('firstDayOfWeek', '' + day)
      .finally(() => this.updatingFirstDayOfWeek = false)
      .subscribe();
  }

  private get password(): string {
    return this.passwordUpdateForm.controls['password'].value;
  }

  private loadDayTranslations(): void {
    this.translateService.get(['SUNDAY', 'MONDAY'])
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
