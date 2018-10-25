import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cs-overlay-loading',
  templateUrl: 'overlay-loading.component.html',
  styleUrls: ['overlay-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayLoadingComponent {
  @Input()
  public active: boolean;
}
