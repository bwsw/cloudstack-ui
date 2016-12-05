import { ModelField } from '../decorators/model-field.decorator';
import { BaseModel } from './base.model';

export class Zone extends BaseModel {
  @ModelField()
  public id: string;

  @ModelField()
  public name: string;
}
