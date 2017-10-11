import { Injectable } from '@angular/core';
import { TagService } from '../../shared/services/tags/tag.service';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { VirtualMachine } from '../shared/vm.model';
import { KeyValuePair } from '../../tags/tags-view/tags-view.component';
import { Observable } from 'rxjs/Observable';
import { UserTagService } from '../../shared/services/tags/user-tag.service';

@Injectable()
export class VmSavePasswordAction  {

 constructor(
   protected tagService: TagService,
   protected userTagService: UserTagService,
   protected dialogService: DialogService
 ) { }

  public activate(vm: VirtualMachine, tag: KeyValuePair ): Observable<any> {
   return this.showConfirmDialog().switchMap(() => this.tagService.update(vm, vm.resourceType, tag.key, tag.value));
  }

  public showConfirmDialog(): Observable<any> {
    return this.dialogService.confirm({message: 'DIALOG_MESSAGES.VM.CONFIRM_SAVE_PASSWORD'})
      .onErrorResumeNext()
      .switchMap((res) => {
        if (res) {
          return this.userTagService.setSavePasswordForAllVms(true);
        }
        return Observable.of(null);
      });
  }
}
