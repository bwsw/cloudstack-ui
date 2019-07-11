import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../../../shared/models';

@Component({
  selector: 'cs-account-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent {
  @Input()
  public account: Account;
  @Input()
  public user: User;

  get userParam() {
    return { firstname: this.user.firstname, lastname: this.user.lastname };
  }
}
