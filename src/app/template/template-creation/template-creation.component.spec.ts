import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';
import { MockTranslateService } from '../../../testutils/mocks/mock-translate.service.spec';
import { Account } from '../../shared/models/account.model';
import { Snapshot } from '../../shared/models/snapshot.model';
import { HypervisorService } from '../../shared/services/hypervisor.service';
import { templateResourceType } from '../shared/base-template.service';
import { TemplateCreationComponent } from './template-creation.component';

describe('Template creation component', () => {
  let fixture: ComponentFixture<TemplateCreationComponent>;
  let component: TemplateCreationComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateCreationComponent, MockTranslatePipe],
      providers: [{ provide: TranslateService, useClass: MockTranslateService }, HypervisorService],
      imports: [FormsModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TemplateCreationComponent);
      component = fixture.componentInstance;
      component.mode = templateResourceType.template;
      component.account = {} as Account;
      component.osTypes = [];
      component.zones = [];
      component.groups = [];
      fixture.detectChanges();
    });
  }));

  it('should get locale', () => {
    expect(component.locale).toEqual('en');
  });

  it('should get hypervisors', () => {
    const spyGetList = spyOn(HypervisorService.prototype, 'getList').and.returnValue(of([]));
    component.getHypervisors();
    expect(spyGetList).toHaveBeenCalled();
  });

  it('should filter formats', () => {
    const result1 = component.filterFormats(component.formats, 'KVM');
    expect(result1).toEqual([
      { name: 'VHD', hypervisors: ['XenServer', 'Hyperv', 'KVM'] },
      { name: 'QCOW2', hypervisors: ['KVM'] },
      { name: 'RAW', hypervisors: ['KVM', 'Ovm'] },
      { name: 'VMDK', hypervisors: ['KVM'] },
    ]);
    const result2 = component.filterFormats(component.formats, null);
    expect(result2).toEqual(component.formats);
  });

  it('should update format', () => {
    component.hypervisor = 'KVM';
    fixture.detectChanges();
    const spyFilterFormat = spyOn(component, 'filterFormats');
    component.changeHypervisor();
    expect(spyFilterFormat).toHaveBeenCalledWith(component.formats, component.hypervisor);
  });

  it('should get translation token', () => {
    const result = component.modeTranslationToken;
    expect(result).toEqual('TEMPLATE_PAGE.TEMPLATE_CREATION.NEW_TEMPLATE');
  });

  it('should create template with main params', () => {
    const params = {
      name: 'test1',
      displayText: 'testText',
      osTypeId: 'testOS',
      passwordEnabled: true,
      isdynamicallyscalable: true,
      url: 'testUrl',
      zoneId: 'testZone',
      entity: templateResourceType.template,
    };

    component.url = params.url;
    component.name = params.name;
    component.displayText = params.displayText;
    component.osTypeId = params.osTypeId;
    component.zoneId = params.zoneId;
    component.passwordEnabled = true;
    component.dynamicallyScalable = true;

    fixture.detectChanges();
    const spyEmit = spyOn(component.templateCreated, 'emit');
    component.onCreate();
    expect(spyEmit).toHaveBeenCalledWith(params);
  });

  it('should create template with snapshot', () => {
    const params = {
      name: 'test1',
      displayText: 'testText',
      osTypeId: 'testOS',
      passwordEnabled: true,
      isdynamicallyscalable: true,
      snapshotId: 'snap1',
      entity: templateResourceType.template,
    };

    component.name = params.name;
    component.snapshot = { id: 'snap1' } as Snapshot;
    component.displayText = params.displayText;
    component.osTypeId = params.osTypeId;
    component.passwordEnabled = true;
    component.dynamicallyScalable = true;

    fixture.detectChanges();
    const spyEmit = spyOn(component.templateCreated, 'emit');
    component.onCreate();
    expect(spyEmit).toHaveBeenCalledWith(params);
  });

  it('should create ISO with main params', () => {
    const params = {
      name: 'test1',
      displayText: 'testText',
      osTypeId: 'testOS',
      url: 'testUrl',
      zoneId: 'testZone',
      entity: templateResourceType.iso,
    };

    component.url = params.url;
    component.name = params.name;
    component.displayText = params.displayText;
    component.osTypeId = params.osTypeId;
    component.zoneId = params.zoneId;
    component.mode = templateResourceType.iso;

    fixture.detectChanges();
    const spyEmit = spyOn(component.templateCreated, 'emit');
    component.onCreate();
    expect(spyEmit).toHaveBeenCalledWith(params);
  });

  it('should create template with main params and group', () => {
    const params = {
      name: 'test1',
      displayText: 'testText',
      osTypeId: 'testOS',
      passwordEnabled: true,
      isdynamicallyscalable: true,
      groupId: 'testG1',
      url: 'testUrl',
      zoneId: 'testZone',
      entity: templateResourceType.template,
    };

    component.templateGroup = { id: 'testG1' };
    component.url = params.url;
    component.name = params.name;
    component.displayText = params.displayText;
    component.osTypeId = params.osTypeId;
    component.zoneId = params.zoneId;
    component.passwordEnabled = true;
    component.dynamicallyScalable = true;

    fixture.detectChanges();
    const spyEmit = spyOn(component.templateCreated, 'emit');
    component.onCreate();
    expect(spyEmit).toHaveBeenCalledWith(params);
  });

  it('should create template with additional params', () => {
    const params = {
      name: 'test1',
      displayText: 'testText',
      osTypeId: 'testOS',
      passwordEnabled: true,
      isdynamicallyscalable: true,
      groupId: 'testG1',
      url: 'testUrl',
      zoneId: 'testZone',
      entity: templateResourceType.template,
      isextractable: true,
      bootable: true,
      format: 'QCOW2',
      requireshvm: true,
      hypervisor: 'KVM',
    };

    component.showAdditional = true;
    component.templateGroup = { id: 'testG1' };
    component.url = params.url;
    component.name = params.name;
    component.displayText = params.displayText;
    component.osTypeId = params.osTypeId;
    component.zoneId = params.zoneId;
    component.passwordEnabled = true;
    component.dynamicallyScalable = true;
    component.isExtractable = true;
    component.bootable = true;
    component.format = 'QCOW2';
    component.requiresHvm = true;
    component.hypervisor = 'KVM';

    fixture.detectChanges();
    const spyEmit = spyOn(component.templateCreated, 'emit');
    component.onCreate();
    expect(spyEmit).toHaveBeenCalledWith(params);
  });

  it('should create template with additional params (as admin)', () => {
    const params = {
      name: 'test1',
      displayText: 'testText',
      osTypeId: 'testOS',
      passwordEnabled: true,
      isdynamicallyscalable: true,
      groupId: 'testG1',
      url: 'testUrl',
      zoneId: 'testZone',
      entity: templateResourceType.template,
      isextractable: true,
      bootable: true,
      format: 'QCOW2',
      requireshvm: true,
      hypervisor: 'KVM',
      isrouting: true,
      isfeatured: true,
      ispublic: true,
    };

    component.account = { accounttype: '1' } as Account;

    component.showAdditional = true;
    component.templateGroup = { id: 'testG1' };
    component.url = params.url;
    component.name = params.name;
    component.displayText = params.displayText;
    component.osTypeId = params.osTypeId;
    component.zoneId = params.zoneId;
    component.passwordEnabled = true;
    component.dynamicallyScalable = true;
    component.isExtractable = true;
    component.bootable = true;
    component.format = 'QCOW2';
    component.requiresHvm = true;
    component.hypervisor = 'KVM';
    component.isRouting = true;
    component.isFeatured = true;
    component.isPublic = true;

    fixture.detectChanges();
    const spyEmit = spyOn(component.templateCreated, 'emit');
    component.onCreate();
    expect(spyEmit).toHaveBeenCalledWith(params);
  });
});
