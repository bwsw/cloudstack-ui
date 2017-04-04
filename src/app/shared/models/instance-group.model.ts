import * as _ from 'lodash';


export class InstanceGroup {
  constructor(public name: string) {};

  public static sortByName(array: Array<InstanceGroup>): Array<InstanceGroup> {
    return _.sortBy(array, 'name');
  }
}
