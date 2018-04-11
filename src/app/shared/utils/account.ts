import { User, Account } from '../models';

export function isHaveSameAccount(user: User, account: Account) {
  return user.account === account.user[0].account;
}
