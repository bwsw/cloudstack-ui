import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cs-menu-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss']
})
export class MenuHeaderComponent {
  @Input()
  username: string;
  @Output()
  buttonClicked = new EventEmitter<boolean>();
}
