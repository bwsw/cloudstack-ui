import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';

@FieldMapper({
  physicalsize: 'physicalSize',
})
export class Snapshot extends BaseModel {
  public id: number;
  public physicalSize: number;
}
