import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


@FieldMapper({
  fingerprint: 'fingerPrint'
})
export class SSHKeyPair extends BaseModel {
  public name: string;
  public fingerPrint: string;
}
