import * as securityGroupSelectors from './sg.reducers';
import { SecurityGroup } from '../../../security-group/sg.model';

describe('Security Group Selectors', () => {
  it('should get sorted groups', () => {
    const list = [
      {
        id: '1',
        name: 'sg1',
      },
      {
        id: '2',
        name: 'sg2',
      },
    ] as SecurityGroup[];

    const preselected = [
      {
        id: '2',
        name: 'sg2',
      },
    ] as SecurityGroup[];

    const sortedList = [
      {
        id: '2',
        name: 'sg2',
        isPreselected: true,
      },
      {
        id: '1',
        name: 'sg1',
        isPreselected: false,
      },
    ] as SecurityGroup[];

    expect(
      securityGroupSelectors.getSortedSecurityGroupForVmDetails.projector(list, preselected),
    ).toEqual(sortedList);
  });
});
