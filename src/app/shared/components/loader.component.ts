import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cs-loader',
  template: '<mdl-spinner class="spinner" single-color active></mdl-spinner>',
  styles: [`
    cs-loader {
      display: block;
      margin: 20px auto;
      text-align: center;
    }

    cs-loader .spinner {
      width: 40px;
      height: 40px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LoaderComponent { }
