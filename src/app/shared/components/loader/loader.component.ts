import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cs-loader',
  template: `
    <div class="container">
      <mat-spinner class="spinner" [diameter]="50" [strokeWidth]="5"></mat-spinner>
    </div>
  `,
  styles: [
    `
      cs-loader {
        text-align: center;
      }

      cs-loader .spinner {
        width: 40px;
        height: 40px;
        margin: 0 auto;
      }

      cs-loader .container {
        padding: 20px 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LoaderComponent {}
