import { HttpClientNoInterceptors } from './../../shared/services/http-client-no-interceptors';
import { TemplateTagService } from './../../shared/services/tags/template-tag.service';
import { AsyncJobService } from './../../shared/services/async-job.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';

import { BackendResource } from '../../shared/decorators';
import { CSCommands } from '../../shared/services/base-backend.service';
import { Template } from './template.model';
import {
  BaseTemplateService,
  CreateTemplateBaseParams,
  RegisterTemplateBaseParams,
  templateResourceType,
} from './base-template.service';
import { TemplateUploadParamsRequest, TemplateUploadParams } from './base-template.service';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';

@Injectable()
@BackendResource({
  entity: templateResourceType.template,
})
export class TemplateService extends BaseTemplateService {
  constructor(
    protected asyncJobService: AsyncJobService,
    protected templateTagService: TemplateTagService,
    protected http: HttpClient,
    private httpClientNoInterceptors: HttpClientNoInterceptors,
  ) {
    super(asyncJobService, templateTagService, http);
  }

  public create(params: CreateTemplateBaseParams): Observable<Template> {
    return this.sendCommand(CSCommands.Create, params).pipe(
      switchMap(job => this.asyncJobService.queryJob(job, this.entity)),
      switchMap(template => {
        if (params.groupId) {
          return this.templateTagService.setGroup(template, { id: params.groupId });
        }
        return of(template);
      }),
      tap(() => this.invalidateCache()),
    );
  }

  public register(params: RegisterTemplateBaseParams): Observable<Template> {
    const requestParams = { ...params };

    requestParams['hypervisor'] = requestParams['hypervisor'] || 'KVM';
    requestParams['format'] = requestParams['format'] || 'QCOW2';
    requestParams['requiresHvm'] = requestParams['requiresHvm'] || true;

    return super.register(requestParams).pipe(tap(() => this.invalidateCache())) as Observable<
      Template
    >;
  }

  public getUploadParamsForTemplate(
    params: TemplateUploadParamsRequest,
  ): Observable<TemplateUploadParams> {
    const requestParams = { ...params };

    requestParams['hypervisor'] = requestParams['hypervisor'] || 'KVM';
    requestParams['format'] = requestParams['format'] || 'QCOW2';
    requestParams['requiresHvm'] = requestParams['requiresHvm'] || true;

    return this.sendCommand(CSCommands.GetUploadParamsFor, requestParams).pipe(
      tap(() => this.invalidateCache()),
      map(({ getuploadparams }) => getuploadparams),
    ) as Observable<TemplateUploadParams>;
  }

  public uploadTemplate(params: TemplateUploadParams): Observable<unknown> {
    const { localTemplate, postURL, expires, metadata, signature } = params;

    const formData = new FormData();
    formData.append('file', localTemplate);

    return this.httpClientNoInterceptors.post(postURL, formData, {
      headers: new HttpHeaders({
        'X-expires': expires,
        'X-metadata': metadata,
        'X-signature': signature,
      }),
      responseType: 'text',
    });
  }
}
