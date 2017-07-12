import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators';


@FieldMapper({
  apikey: 'apiKey',
  secretkey: 'secretKey'
})
export class User extends BaseModel {
  public apiKey: string;
  public secretKey: string;
}
