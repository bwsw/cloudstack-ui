import { Account, User } from '../models';

export function isUserBelongsToAccount(user: User, account: Account) {
  return account.user != null && user.account === account.user[0].account;
}
