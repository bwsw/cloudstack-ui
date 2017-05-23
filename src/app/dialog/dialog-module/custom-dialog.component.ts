import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MdlButtonComponent } from '@angular-mdl/core';
import { Observable } from 'rxjs/Observable';
import { DialogType, DialogTypes, ParametrizedTranslation } from './dialog.service';
import { MdlDialogReference } from './mdl-dialog.service';


export interface CustomSimpleDialogConfig {
  message: string | ParametrizedTranslation;
  dialogType?: DialogType;
  confirmText?: string;
  declineText?: string;
  title?: string;
  width?: string;
  clickOutsideToCllose?: boolean;
}

@Component({
  selector: 'cs-custom-dialog',
  templateUrl: 'custom-dialog.component.html',
  styleUrls: ['custom-dialog.component.scss']
})
export class CustomSimpleDialogComponent implements OnInit {
  public config: CustomSimpleDialogConfig;
  @ViewChild(MdlButtonComponent) private focusButton: MdlButtonComponent;

  constructor(
    @Inject('config') config: any,
    protected dialog: MdlDialogReference,
    protected translateService: TranslateService
  ) {
    this.config = config;
  }

  public ngOnInit(): void {
    this.dialog.onVisible()
      .subscribe(() => {
        this.focusButton.elementRef.nativeElement.focus();
      });
  }

  public get translatedMessage(): Observable<string> {
    if (typeof this.config.message === 'string') {
      return this.translateService.get(this.config.message);
    } else {
      return this.translateService.get(
        this.config.message.translationToken,
        this.config.message.interpolateParams
      );
    }
  }

  public get showDeclineButton(): boolean {
    return this.config.dialogType === DialogTypes.CONFIRM;
  }

  public confirm(): void {
    this.dialog.hide(true);
  }

  public decline(): void {
    this.dialog.hide(false);
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialog.hide();
  }
}
