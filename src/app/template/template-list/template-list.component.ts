import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { MdlDialogService, MdlDialogReference } from 'angular2-mdl';

import { TemplateCreationComponent } from '../template-creation/template-creation.component';

@Component({
  selector: 'cs-template-list',
  templateUrl: 'template-list.component.html',
  styleUrls: ['template-list.component.scss']
})
export class TemplateListComponent {
  private dialogObservable: Observable<any>;

  constructor(
    private dialogService: MdlDialogService,
  ) {}

  public showCreationDialog(): void {
    this.dialogObservable = this.dialogService.showCustomDialog({
      component: TemplateCreationComponent,
      isModal: true,
      styles: { 'width': '720px', 'overflow': 'visible' },
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });

    this.dialogObservable.switchMap(res => res.onHide())
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        this.test(data);
      });
  }

  public test(data) {
    console.log(data);
  }
}
