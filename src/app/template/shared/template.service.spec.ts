import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { TagService } from '../../shared/services/tags/tag.service';
import { TemplateTagKeys } from '../../shared/services/tags/template-tag-keys';
import { TemplateTagService } from '../../shared/services/tags/template-tag.service';
import { BaseTemplateService } from './base-template.service';
import { Template } from './template.model';
import { TemplateService } from './template.service';

describe('Template service test', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AsyncJobService,
        TemplateTagService,
        TagService,
        TemplateService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
  }));

  it('should create without group', async(inject([TemplateService], (testService) => {
    const params = {
      name: 'test-template-1',
      displaytext: 'test',
      ostypeid: '123',
      snapshotid: '123',
      entity: 'Template'
    };
    const template = new Template(params);
    const spySend = spyOn(testService, 'sendCommand').and.callFake(() => {
      return Observable.of({
        'id': '1',
        'jobid': 'job1'
      });
    });

    const spyQueryJob = spyOn(testService.asyncJobService, 'queryJob').and
      .returnValue(Observable.of(template));

    testService.create(params).subscribe(res => {
      expect(res).toEqual(template);
    });

    expect(spySend).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith('create', params);
    expect(spyQueryJob).toHaveBeenCalled();
  })));

  it('should create with group', async(inject([TemplateService], (testService) => {
    const params = {
      name: 'test-template-1',
      displaytext: 'test',
      ostypeId: '123',
      snapshotId: '123',
      groupId: 'group1',
      entity: 'Template'
    };
    const template1 = new Template(params);
    const template2 = Object.assign(
      {},
      new Template(params),
      { tags: [{ key: TemplateTagKeys.group, value: 'group1' }] }
    );

    const spySend = spyOn(testService, 'sendCommand').and.callFake(() => {
      return Observable.of({
        'id': '1',
        'jobid': 'job1'
      });
    });

    const spyQueryJob = spyOn(testService.asyncJobService, 'queryJob').and
      .returnValue(Observable.of(template1));
    const spySetGroup = spyOn(testService.templateTagService, 'setGroup').and
      .callThrough();
    const spyUpdate = spyOn(testService.templateTagService.tagService, 'update').and
      .returnValue(Observable.of(template2));

    testService.create(params).subscribe(res => {
      expect(res).toEqual(template2);
    });

    expect(spySend).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith('create', params);
    expect(spyQueryJob).toHaveBeenCalled();
    expect(spySetGroup).toHaveBeenCalled();
    expect(spyUpdate)
      .toHaveBeenCalledWith(template1, 'Template', TemplateTagKeys.group, 'group1');
  })));

  it('should register', async(inject([TemplateService], (testService) => {
    const params = {
      name: 'test-template-1',
      displaytext: 'test',
      ostypeid: '123',
      entity: 'Template'
    };
    const requestParams = Object.assign({}, params, {
      hypervisor: 'KVM',
      format: 'QCOW2',
      requiresHvm: true
    });
    const template = new Template(params);
    const spyRegister = spyOn(BaseTemplateService.prototype, 'register').and
      .returnValue(Observable.of(template));

    testService.register(params).subscribe(res => {
      expect(res).toEqual(template);
    });

    expect(spyRegister).toHaveBeenCalledWith(requestParams);
  })));

});
