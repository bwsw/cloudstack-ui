import { NgModule } from '@angular/core';
import { BadgeDirective } from './badge.directive';


@NgModule({
  exports: [BadgeDirective],
  declarations: [BadgeDirective],
})
export class BadgeModule {
}
