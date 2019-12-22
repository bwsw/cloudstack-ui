import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cs-menu-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss'],
})
export class MenuHeaderComponent {}
