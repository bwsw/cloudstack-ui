import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';

import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';
import { SecurityGroup } from '../sg.model';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from '../../../testutils/mocks/mock-translate.service.spec';
import { SgRulesComponent } from './sg-rules.component';
import { FormsModule } from '@angular/forms';
import { MD_DIALOG_DATA, MdAutocompleteModule, MdDialogRef } from '@angular/material';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from '../../shared/services/notification.service';
import { MockNotificationService } from '../../../testutils/mocks/mock-notification.service';


describe('Security group firewall rules component', () => {
  let f;
  let comp;

  const mockSecurityGroup = new SecurityGroup({
    id: '9d1f0e3b-82a7-4528-b02e-70c4f9eff4b0',
    name: 'test',
    description: '',
    account: 'develop',
    domain: 'ROOT',
    ingressRules: [],
    tags: [],
    virtualMachinesCount: 0,
    virtualMachineIds: []
  });

  class SecurityGroupServiceMock {
    public getTemplates(): Array<SecurityGroup> {
      return [mockSecurityGroup];
    }

    public getList(): Observable<Array<SecurityGroup>> {
      return Observable.of([mockSecurityGroup]);
    }
  }

  beforeEach(async(() => {
    const dialog = jasmine.createSpyObj('MdDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [FormsModule, MdAutocompleteModule],
      declarations: [SgRulesComponent, MockTranslatePipe],
      providers: [
        { provide: MdDialogRef, useValue: dialog },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: MD_DIALOG_DATA, useValue: { securityGroup: mockSecurityGroup } },
        { provide: SecurityGroupService, useClass: SecurityGroupServiceMock },
        { provide: NotificationService, useClass: MockNotificationService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    TestBed.compileComponents().then(() => {
      f = TestBed.createComponent(SgRulesComponent);
      comp = f.componentInstance;
      console.log(comp);
    });
  }));

  it('filter lists of ICMP types and codes', () => {
    const filteredTypes = comp.filterTypes('-1');
    expect(filteredTypes.length).toEqual(1);

    comp.selectedType = filteredTypes[0].type.toString();
    comp.setIcmpTypes(filteredTypes);
    const filteredCodes = comp.filterCodes('-1');
    expect(filteredCodes.length).toEqual(1);

    comp.selectedCode = filteredCodes[0].toString();
    comp.setIcmpCodes(comp.selectedCode);
    expect(comp.icmpType).toEqual(-1);
    expect(comp.icmpCode).toEqual(-1);
  });
});
