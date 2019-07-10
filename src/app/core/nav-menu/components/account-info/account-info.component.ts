import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cs-account-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent {
  @Input()
  public account: Account;
}
