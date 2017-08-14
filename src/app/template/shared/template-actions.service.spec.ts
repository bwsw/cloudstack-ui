import { Injectable } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { JobsNotificationService } from '../../shared/services';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { VmService } from '../../vm/shared/vm.service';
import { TemplateActionsService } from './template-actions.service';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { Template } from './template.model';
import { IsoService } from './iso.service';
import { TemplateService } from './template.service';
import { Iso } from './iso.model';


@Injectable()
class MockDialogService {
  public alert(): void {}

  public confirm(): Observable<void> {
    return Observable.of(null);
  };
}

@Injectable()
class MockJobsNotificationService {
  public add(): void {}
  public finish(): void {}
  public fail(): void {}
}

@Injectable()
class MockTemplateService {
  public create(params: any): Observable<Template> {
    return Observable.of(new Template(JSON.stringify(params)));
  }

  public register(params: any): Observable<Template> {
    return Observable.of(new Template(JSON.stringify(params)));
  }
}

@Injectable()
class MockIsoService {
  public register(params: any): Observable<Iso> {
    return Observable.of(new Iso(JSON.stringify(params)));
  }
}

@Injectable()
class MockVmService {
  public getListOfVmsThatUseIso(): Observable<Array<VirtualMachine>> {
    return Observable.of([]);
  }
}

describe('Template actions service', () => {
  let templateActionsService: TemplateActionsService;
  let templateService: TemplateService;
  let isoService: IsoService;

  let templateRegister;
  let templateCreate;
  let isoRegister;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        TemplateActionsService,
        { provide: DialogService, useClass: MockDialogService },
        { provide: JobsNotificationService, useClass: MockJobsNotificationService },
        { provide: TemplateService, useClass: MockTemplateService },
        { provide: IsoService, useClass: MockIsoService },
        { provide: VmService, useClass: MockVmService }
      ]
    });

    templateActionsService = TestBed.get(TemplateActionsService);
    templateService = TestBed.get(TemplateService);
    isoService = TestBed.get(IsoService);

    templateRegister = jest.spyOn(templateService, 'register');
    templateCreate = jest.spyOn(templateService, 'create');
    isoRegister = jest.spyOn(isoService, 'register');
  }));

  it('should call template register with correct params', () => {
    const viewMode = 'Template';
    const templateCreationParams = {
      url: 'testUrl',
      zoneId: 'testZoneId',
      passwordEnabled: true,
      isDynamicallyScalable: true
    };

    templateActionsService.createTemplate(templateCreationParams, viewMode).subscribe();
    expect(templateRegister).toHaveBeenCalled();
    expect(templateCreate).toHaveBeenCalledTimes(0);
    expect(isoRegister).toHaveBeenCalledTimes(0);
  });

  it('should call template create with correct params', () => {
    const viewMode = 'Template';
    const templateCreationParams = {
      snapshotId: 'testSnapshotId',
      passwordEnabled: true,
      isDynamicallyScalable: true
    };

    templateActionsService.createTemplate(templateCreationParams, viewMode).subscribe();
    expect(templateRegister).toHaveBeenCalledTimes(0);
    expect(templateCreate).toHaveBeenCalled();
    expect(isoRegister).toHaveBeenCalledTimes(0);
  });

  it('should call iso register with correct params', () => {
    const viewMode = 'Iso';
    const templateCreationParams = {
      url: 'testUrl',
      zoneId: 'testZoneId',
    };

    templateActionsService.createTemplate(templateCreationParams, viewMode).subscribe();
    expect(templateRegister).toHaveBeenCalledTimes(0);
    expect(templateCreate).toHaveBeenCalledTimes(0);
    expect(isoRegister).toHaveBeenCalled();
  });
});

