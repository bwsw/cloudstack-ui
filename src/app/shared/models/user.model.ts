import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators';
import { AccountType } from './account.model';


@FieldMapper({
  apikey: 'apiKey',
  secretkey: 'secretKey',
  userid: 'userId'
})
export class User extends BaseModel {
  public account: string;
  public domain: string;
  public domainid: string;
  public firstname: string;
  public lastname: string;
  public registered: boolean;
  public sessionkey: string;
  public timeout: number;
  public timezone: string;
  public type: AccountType;
  public userId: string;
  public username: string;

  public apiKey: string;
  public secretKey: string;

  constructor(json?: any) {
    super(json);

    // fixing cloudstack API quirks

    // json contains registered as a string
    if (this.registered) {
      try {
        this.registered = JSON.parse(this.registered as any);
      } catch (e) {

      }
    }
    // json contains type as a string
    if (this.type) {
      this.type = parseInt(this.type as any, 10);
    }
  }

  public get name(): string {
    return `${this.firstname} ${this.lastname}`;
  }
}
