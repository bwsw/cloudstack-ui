import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators';

@FieldMapper({
  physicalsize: 'physicalSize',
  volumeid: 'volumeId'
})
export class Snapshot extends BaseModel {
  public id: string;
  public physicalSize: number;
  public volumeId: string;
  public name: string;
}
