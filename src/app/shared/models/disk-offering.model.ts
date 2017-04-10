import { FieldMapper } from '../decorators/field-mapper.decorator';
import { Offering } from './offering.model';


@FieldMapper({
  disksize: 'diskSize',
})
export class DiskOffering extends Offering {
  public diskSize: number;
}
