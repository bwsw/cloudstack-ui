import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cs-menu-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss'],
})
export class MenuHeaderComponent {
  @Input()
  public username: string;
  @Output()
  public buttonClicked = new EventEmitter<void>();

  public onButtonClicked(): void {
    this.buttonClicked.emit();
  }
}
