import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cs-loader',
  template: '<mat-spinner class="spinner" [diameter]="50" [strokeWidth]="5"></mat-spinner>',
  styles: [
    `
      cs-loader {
        text-align: center;
      }

      cs-loader .spinner {
        width: 40px;
        height: 40px;
        margin: 20px auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LoaderComponent {}
