import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cs-license',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent {
  public year: string;

  constructor() {
    this.year = new Date().getFullYear().toString();
  }
}
