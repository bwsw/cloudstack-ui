import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'cs-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordComponent {
  /**
   * The password to be shown.
   */
  @Input() password: string;

  /**
   * Whether the password should be revealed or hidden (with * chars).
   */
  public get visible() {
    return this._visible;
  }
  private _visible = false;

  constructor(private cd: ChangeDetectorRef) {}

  toggleVisibility() {
    this._visible = !this._visible;
    this.cd.markForCheck();
  }
}
