import { Sort } from '../decorators/sort.decorator';


@Sort('name')
export class InstanceGroup {
  public static sortByName: any;

  constructor(public name: string) {};
}
