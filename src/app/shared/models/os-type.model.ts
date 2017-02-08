import { BaseModel } from '.';
import { FieldMapper } from '../decorators/field-mapper.decorator';

export type OsFamily = 'Linux' | 'Windows' | 'Mac OS' | 'Other';

@FieldMapper({
  isuserdefined: 'isUserDefined',
  oscategory: 'osCategory'
})
export class OsType extends BaseModel {
  public id: string;
  public description: string;
  public isUserDefined: boolean;
  public osCategory: string;

  public osFamily: OsFamily;
}
