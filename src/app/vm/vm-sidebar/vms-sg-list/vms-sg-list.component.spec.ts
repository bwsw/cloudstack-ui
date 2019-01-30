import { TestBed } from '@angular/core/testing';
import { VmsSgListComponent } from './vms-sg-list.component';
import { SecurityGroup } from '../../../security-group/sg.model';

describe('VmsSgListComponent', () => {
  let comp: VmsSgListComponent;
  const securityGroup = { id: 'sg-1', name: 'name', isPreselected: false } as SecurityGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    comp = new VmsSgListComponent();
  });

  it('should select security group', () => {
    comp.selectSecurityGroup(securityGroup);
    expect(comp.currentSelectedSecurityGroup).toBe(securityGroup);
  });
});
