import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


export const ResourceTypes = {
  USER: 'User',
  VM: 'UserVm'
};

export const DeletionMark = {
  TAG: 'status',
  VALUE: 'removed'
};

const defaultCategoryName = 'Common';

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

  public get categoryName(): string {
    const tagParts = this.key.split('.');
    const categoryNameIsPresent = tagParts.length > 1;

    return categoryNameIsPresent ? tagParts[0] : defaultCategoryName;
  }
}
