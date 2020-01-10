import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { MockTranslatePipe } from '../../../../../testutils/mocks/mock-translate.pipe.spec';
import { FirewallRulesDetailComponent } from './firewall-rules-detail.component';

describe('FirewallRulesDetailComponent', () => {
  let component: FirewallRulesDetailComponent;
  let fixture: ComponentFixture<FirewallRulesDetailComponent>;

  const vm = require('../../../../../testutils/mocks/model-services/fixtures/vms.json')[0];
  const groups = require('.././../../../../testutils/mocks/model-services/fixtures/securityGroupTemplates.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [FirewallRulesDetailComponent, MockTranslatePipe],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirewallRulesDetailComponent);
    component = fixture.componentInstance;
  });

  function findButtons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.grid.details button'));
  }

  function findDetachButtons(): HTMLButtonElement[] {
    return findButtons().filter(btn => btn.classList.contains('button-18px'));
  }

  it('should not disable the detach button if there are multiple rules', () => {
    component.vm = {
      ...vm,
      securitygroup: groups,
    };
    fixture.detectChanges();

    expect(findDetachButtons().every(btn => !btn.disabled)).toBe(true);
  });

  it('should disable the debtach button if there is only a single rule', () => {
    component.vm = {
      ...vm,
      securitygroup: groups[0],
    };
    fixture.detectChanges();

    expect(findDetachButtons().every(btn => btn.disabled)).toBe(true);
  });
});
