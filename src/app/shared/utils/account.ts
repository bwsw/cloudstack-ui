import { Account, User } from '../models';

export function isUserBelongsToAccount(user: User, account: Account): boolean {
  /*
   * if you check user object from login, then it does not have an accountid property
   * thus need to check by name
   */
  return user.accountid === account.id || user.account === account.name;
}
