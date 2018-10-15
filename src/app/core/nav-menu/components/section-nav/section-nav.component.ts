import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subroute } from '../../models';

@Component({
  selector: 'cs-section-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-nav.component.html',
  styleUrls: ['./section-nav.component.scss']
})
export class SectionNavComponent {
  @Input()
  subroutes: Subroute[];
  @Input()
  username: string;
  @Output()
  openAppNav = new EventEmitter<boolean>();
}
