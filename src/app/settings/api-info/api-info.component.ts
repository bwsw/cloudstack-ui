import { Component, OnInit } from '@angular/core';
import { BACKEND_API_URL, ConfigService, NotificationService } from '../../shared/services';
import { UserService } from '../../shared/services/user.service';
import { Observable } from 'rxjs/Observable';


interface ApiInfoTextField {
  title: string;
  value: string;
}

interface ApiInfoLink {
  title: string;
  href: string;
}

@Component({
  selector: 'cs-api-info',
  templateUrl: 'api-info.component.html',
  styleUrls: ['api-info.component.scss']
})
export class ApiInfoComponent implements OnInit {
  public linkFields: Array<ApiInfoLink>;
  public inputFields: Array<ApiInfoTextField>;

  constructor(
    private configService: ConfigService,
    private notificationService: NotificationService,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    Observable.forkJoin(
      this.userService.getApiKey(),
      this.userService.getSecretKey(),
      this.configService.get('API_DOC_LINK')
    )
      .subscribe(([apiKey, secretKey, apiDocLink]) => {
        this.linkFields = [
          { title: 'API_URL', href: this.apiUrl },
          { title: 'API_DOC_LINK', href: apiDocLink }
        ];

        this.inputFields = [
          { title: 'API_KEY', value: apiKey },
          { title: 'API_SECRET_KEY', value: secretKey }
        ];
      });
  }

  private get apiUrl(): string {
    return location.origin + BACKEND_API_URL;
  }

  public onCopySuccess(): void {
    this.notificationService.message('COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('COPY_FAIL');
  }
}
