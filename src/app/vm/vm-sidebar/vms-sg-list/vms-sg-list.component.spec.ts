import { TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

import { VmsSgListComponent } from './vms-sg-list.component';
import { getMockSecurityGroup } from '../../../../testutils/mocks/mocks';

describe('VmsSgListComponent', () => {
  let comp: VmsSgListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    comp = new VmsSgListComponent();
  });

  describe('selectSecurityGroup', () => {
    it('should select security group', () => {
      const securityGroup = getMockSecurityGroup({ id: 'sg-1', isPreselected: false });
      comp.selectSecurityGroup(securityGroup);
      expect(comp.currentSelectedSecurityGroup).toBe(securityGroup);
    });

    it('should not select preselected security group', () => {
      const securityGroup = getMockSecurityGroup({ id: 'sg-1', isPreselected: true });
      comp.selectSecurityGroup(securityGroup);
      expect(comp.currentSelectedSecurityGroup).toBeUndefined();
    });
  });

  describe('ngOnChanges', () => {
    it('should change currentSelectedSecurityGroup', () => {
      const securityGroups = [
        getMockSecurityGroup({ id: 'first_preselected', isPreselected: true }),
        getMockSecurityGroup({ id: 'first_not_selected', isPreselected: false }),
        getMockSecurityGroup({ id: 'second_not_selected', isPreselected: false }),
      ];
      comp.securityGroups = securityGroups;
      comp.ngOnChanges({ securityGroups: new SimpleChange(null, securityGroups, false) });
      expect(comp.currentSelectedSecurityGroup).toEqual(securityGroups[1]);
    });

    it('should not change currentSelectedSecurityGroup if it was selected', () => {
      const securityGroups = [
        getMockSecurityGroup({ id: 'first_preselected', isPreselected: true }),
        getMockSecurityGroup({ id: 'first_not_selected', isPreselected: false }),
        getMockSecurityGroup({ id: 'second_not_selected', isPreselected: false }),
      ];
      comp.currentSelectedSecurityGroup = securityGroups[2];
      comp.securityGroups = securityGroups;
      comp.ngOnChanges({ securityGroups: new SimpleChange([], securityGroups, false) });
      expect(comp.currentSelectedSecurityGroup).toEqual(securityGroups[2]);
    });

    it('should change currentSelectedSecurityGroup if it not in securityGroups', () => {
      const securityGroups = [
        getMockSecurityGroup({ id: 'first_preselected', isPreselected: true }),
        getMockSecurityGroup({ id: 'first_not_selected', isPreselected: false }),
        getMockSecurityGroup({ id: 'second_not_selected', isPreselected: false }),
      ];
      comp.currentSelectedSecurityGroup = getMockSecurityGroup();
      comp.securityGroups = securityGroups;
      comp.ngOnChanges({ securityGroups: new SimpleChange([], securityGroups, false) });
      expect(comp.currentSelectedSecurityGroup).toEqual(securityGroups[1]);
    });
  });
});
