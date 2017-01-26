import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';

@FieldMapper({
  physicalsize: 'physicalSize',
  volumeid: 'volumeId'
})
export class Snapshot extends BaseModel {
  public id: string;
  public physicalSize: number;
  public volumeId: string;
}
