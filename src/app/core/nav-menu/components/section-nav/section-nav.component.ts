import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subroute } from '../../models';

@Component({
  selector: 'cs-section-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-nav.component.html',
  styleUrls: ['./section-nav.component.scss'],
})
export class SectionNavComponent {
  @Input()
  public subroutes: Subroute[];
  @Input()
  public username: string;
  @Output()
  public menuButtonClicked = new EventEmitter<void>();

  public onMenuButtonClicked(): void {
    this.menuButtonClicked.emit();
  }
}
