import { Component, Input, OnInit } from '@angular/core';
import { DefaultUrlSerializer, UrlSerializer } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { BACKEND_API_URL } from '../../shared/services/base-backend.service';
import { ConfigService } from '../../shared/services/config.service';
import { NotificationService } from '../../shared/services/notification.service';
import { RouterUtilsService } from '../../shared/services/router-utils.service';
import { UserService } from '../../shared/services/user.service';
import { DialogsService } from '../../dialog/dialog-service/dialog.service';


interface ApiInfoLink {
  title: string;
  href: string;
}

interface ApiInfoTextField {
  title: string;
  value: string;
}

interface ApiInfoLinks {
  apiUrl: ApiInfoLink;
  apiDocLink: ApiInfoLink;
}

interface ApiInfoTextFields {
  apiKey: ApiInfoTextField;
  apiSecretKey: ApiInfoTextField;
}

interface ApiKeys {
  apiKey: string;
  secretKey: string;
}

@Component({
  selector: 'cs-api-info',
  templateUrl: 'api-info.component.html',
  styleUrls: ['api-info.component.scss']
})
export class ApiInfoComponent implements OnInit {
  @Input() public userId: string;
  public linkFields: ApiInfoLinks;
  public inputFields: ApiInfoTextFields;
  public loading: boolean;
  private urlSerializer: UrlSerializer;

  constructor(
    private configService: ConfigService,
    private dialogsService: DialogsService,
    private notificationService: NotificationService,
    private userService: UserService,
    private routerUtilsService: RouterUtilsService
  ) {
    this.urlSerializer = new DefaultUrlSerializer();
  }

  public ngOnInit(): void {
    this.loading = true;
    const apiDocLink = this.configService.get('apiDocLink');
    this.getApiKeys()
      .finally(() => this.loading = false)
      .subscribe(apiKeys => {
        this.linkFields = {
          apiUrl: { title: 'API_URL', href: this.apiUrl },
          apiDocLink: { title: 'API_DOC_LINK', href: apiDocLink }
        };

        this.inputFields = {
          apiKey: { title: 'API_KEY', value: apiKeys.apiKey },
          apiSecretKey: { title: 'API_SECRET_KEY', value: apiKeys.secretKey }
        };
      });
  }

  public askToRegenerateKeys(): void {
    this.dialogsService.confirm({
      message: 'ASK_GENERATE_KEYS'
    })
      .onErrorResumeNext()
      .subscribe((res) => { if (res) { this.regenerateKeys(); } });
  }

  private get apiUrl(): string {
    return [
      this.routerUtilsService.getLocationOrigin().replace(/\/$/, ''),
      this.routerUtilsService.getBaseHref().replace(/^\//, '').replace(/\/$/, ''),
      BACKEND_API_URL
    ]
      .filter(s => s)
      .join('/');
  }

  public onCopySuccess(): void {
    this.notificationService.message('COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('COPY_FAIL');
  }

  private getApiKeys(): Observable<ApiKeys> {
    return this.userService.getList()
      .map(users => {
        if (!users || !users.length) {
          throw new Error('Unable to get user\'s API key');
        } else {
          return {
            apiKey: users[0].apiKey,
            secretKey: users[0].secretKey
          };
        }
      });
  }

  private regenerateKeys(): void {
    this.loading = true;
    this.userService.registerKeys(this.userId)
      .finally(() => this.loading = false)
      .subscribe(keys => {
        this.inputFields.apiKey.value = keys.apikey;
        this.inputFields.apiSecretKey.value = keys.secretkey;
      });
  }
}
