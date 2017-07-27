import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdlDialogService } from '../dialog/dialog-module';
import { AuthService } from '../shared/services';
import { RouterUtilsService } from '../shared/services/router-utils.service';
import { Utils } from '../shared/services/utils.service';


@Component({
  selector: 'cs-logout',
  template: '<div></div>'
})
export class LogoutComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private dialogService: MdlDialogService,
    private router: Router,
    private routerUtilsService: RouterUtilsService
  ) {}

  public ngOnInit(): void {
    this.authService.logout().subscribe(() => {
      const next = this.activatedRoute.snapshot.queryParams['next'];
      const redirectionParams = next ? Utils.getRedirectionQueryParams(next) : {};
      this.router.navigate(['/login'], redirectionParams);
      this.dialogService.hideAllDialogs();
    });
  }
}
