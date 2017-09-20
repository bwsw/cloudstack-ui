import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


@FieldMapper({
  fingerprint: 'fingerPrint',
  privatekey: 'privateKey'
})
export class SSHKeyPair extends BaseModel {
  public name: string;
  public fingerPrint: string;
  public privateKey: string;
  public account: string;
  public domainid: string;
}
