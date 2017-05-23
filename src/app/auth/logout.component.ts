import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services';
import { Router } from '@angular/router';
import { MdlDialogService } from '../dialog/dialog-module';


@Component({
  selector: 'cs-logout',
  template: ''
})
export class LogoutComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private dialogService: MdlDialogService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
      this.dialogService.hideAllDialogs();
    });
  }
}
