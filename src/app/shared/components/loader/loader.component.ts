import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cs-loader',
  template: '<md-spinner class="spinner"></md-spinner>',
  styles: [`
    cs-loader {
      text-align: center;
    }

    cs-loader .spinner {
      width: 40px;
      height: 40px;
      margin: 20px auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LoaderComponent { }
