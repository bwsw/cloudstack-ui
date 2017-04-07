import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


export const ResourceTypes = {
  USER: 'User'
};

@FieldMapper({
  domainid: 'domainId',
  resourceid: 'resourceId',
  resourcetype: 'resourceType'
})
export class Tag extends BaseModel {
  public account: string;
  public domain: string;
  public domainId: string;
  public key: string;
  public resourceId: string;
  public resourceType: string;
  public value: string;
}
