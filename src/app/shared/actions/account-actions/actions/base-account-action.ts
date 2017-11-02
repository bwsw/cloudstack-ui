import { Account } from '../../../models/account.model';

export interface BaseAccountAction {
  name: string;
  command: string;
  icon?: string;
  confirmMessage: string;
  canActivate: (account: Account) => boolean;
}
