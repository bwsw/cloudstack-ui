import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cs-license',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="license">
      {{ 'NAVIGATION_SIDEBAR.LICENSE.LICENSE_1' | translate: { year: getCurrentYear() } }}
      <a href="https://bitworks.software/" target="_blank">
        {{ 'NAVIGATION_SIDEBAR.LICENSE.LICENSE_2' | translate }}
      </a>
      <br>
      {{ 'NAVIGATION_SIDEBAR.LICENSE.LICENSE_3' | translate }}
    </div>
  `,
  styles: [`
    .license {
      font-size: 12px;
      padding: 5px;
      line-height: 1;
      text-align: center;
    }

    a {
      color: inherit;
    }
  `]
})

export class LicenseComponent {
  public getCurrentYear(): string {
    return new Date().getFullYear().toString();
  }
}
