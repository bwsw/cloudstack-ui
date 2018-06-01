import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import { Color } from '../shared/models/color.model';
import { AuthService } from '../shared/services/auth.service';
import { Language, LanguageService, TimeFormat } from '../shared/services/language.service';
import { SnackBarService } from '../shared/services/snack-bar.service';
import { StyleService, themes } from '../shared/services/style.service';
import { UserTagService } from '../shared/services/tags/user-tag.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'cs-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('passwordForm') public passwordForm: NgForm;

  public userId: string;
  public firstDayOfWeek = 1;
  public language: string;
  public primaryColor: Color;
  public primaryColors: Array<Color>;
  public timeFormat: string = TimeFormat.AUTO;
  public savePassword: boolean;

  public passwordUpdateForm: FormGroup;

  public updatingFirstDayOfWeek = false;
  public updatingTimeFormat = false;
  // public dayTranslations: {};
  public settingLanguage = false;

  public primaryColorControl = new FormControl();

  public languages = [
    { value: Language.en, text: 'English' },
    { value: Language.ru, text: 'Русский' }
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
    private notificationService: SnackBarService,
    private styleService: StyleService,
    private userService: UserService,
    private userTagService: UserTagService
  ) {
    this.userId = this.authService.user.userid;
  }

  public ngOnInit(): void {
    this.loadSaveVmPassword();
    this.getLanguage();
    this.loadColors();
    this.loadFirstDayOfWeek();
    this.buildForm();
    this.loadTimeFormat();
  }

  public getTimeFormatTranslationToken(format: TimeFormat): string {
    const timeFormatTranslations = {
      hour12: 'SETTINGS.LOOK_AND_FEEL.hour12',
      hour24: 'SETTINGS.LOOK_AND_FEEL.hour24',
      AUTO: 'SETTINGS.LOOK_AND_FEEL.AUTO'
    };

    return timeFormatTranslations[format];
  }

  public doSavePasswordForAllVms(value: boolean): void {
    this.userTagService.setSavePasswordForAllVms(value).subscribe();
  }

  public changeLanguage(change: MatSelectChange): void {
    this.settingLanguage = true;
    this.languageService.setLanguage(change.value)
      .finally(() => this.settingLanguage = false)
      .subscribe();
  }

  public changeTimeFormat(change: MatSelectChange): void {
    this.updatingTimeFormat = true;
    this.languageService
      .setTimeFormat(change.value)
      .finally(() => (this.updatingTimeFormat = false))
      .subscribe();
  }

  public updatePrimaryColor(color: Color): void {
    this.primaryColor = color;
    this.updatePalette();
  }

  public updatePalette(): void {
    const theme = themes.find(t => t.primaryColor === this.primaryColor.value);
    this.styleService.setTheme(theme).subscribe();
  }

  public updatePassword(): void {
    this.userService
      .updatePassword(this.userId, this.password)
      .subscribe(
        () =>
          this.notificationService.message(
            'SETTINGS.SECURITY.PASSWORD_CHANGED_SUCCESSFULLY'
          ),
        error => this.notificationService.message(error.errortext)
      );
    this.passwordUpdateForm.reset();
    this.passwordForm.resetForm();
  }

  public firstDayOfWeekChange(change: MatSelectChange): void {
    this.firstDayOfWeek = change.value;
    this.updatingFirstDayOfWeek = true;
    this.userTagService
      .setFirstDayOfWeek(change.value)
      .finally(() => (this.updatingFirstDayOfWeek = false))
      .subscribe();
  }

  private get password(): string {
    return this.passwordUpdateForm.controls['password'].value;
  }

  private loadSaveVmPassword(): void {
    this.userTagService.getSavePasswordForAllVms()
      .subscribe(savePassword => {
        this.savePassword = savePassword;
      });
  }

  private getLanguage(): void {
    this.languageService
      .getLanguage()
      .subscribe(language => (this.language = language));
  }

  private loadColors(): void {
    this.styleService.getTheme().subscribe(theme => {
      if (theme) {
        this.primaryColor = new Color(theme.name, theme.primaryColor);
      }

      this.primaryColors = themes.map(t => new Color(t.name, t.primaryColor));
    });
  }

  private loadFirstDayOfWeek(): void {
    this.languageService
      .getFirstDayOfWeek()
      .subscribe((day: number) => (this.firstDayOfWeek = day));
  }

  private loadTimeFormat(): void {
    this.languageService
      .getTimeFormat()
      .subscribe(timeFormat => (this.timeFormat = timeFormat));
  }

  private buildForm(): void {
    this.passwordUpdateForm = this.formBuilder.group(
      {
        password: ['', Validators.required],
        passwordRepeat: ['', Validators.required]
      },
      { validator: this.passwordsNotEqual }
    );
  }

  private passwordsNotEqual(
    formGroup: FormGroup
  ): { passwordsNotEqual: true } | null {
    const valid =
      formGroup.controls['password'].value ===
      formGroup.controls['passwordRepeat'].value;
    return valid ? null : { passwordsNotEqual: true };
  }
}
