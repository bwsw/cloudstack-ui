import { Component, ViewChild } from '@angular/core';
import { MdlSelectComponent } from '@angular2-mdl-ext/select';
import { CustomDialogService } from '../shared/services/custom-dialog.service';
import { CustomServiceOfferingComponent } from '../service-offering/custom-service-offering/custom-service-offering.component';

@Component({
  selector: 'cs-test',
  templateUrl: 'test.component.html',
  providers: [CustomDialogService]
})
export class TestComponent {
  @ViewChild(MdlSelectComponent) public selectComponent: MdlSelectComponent;
  public selectedValue: number;

  constructor(private dialogService: CustomDialogService) {}

  public changeValue(newValue: number): void {
    if (newValue === 5) {
      this.dialogService.showCustomDialog({
        component: CustomServiceOfferingComponent
      })
        .switchMap(res => res.onHide())
        .subscribe(result => {
          console.log(result);
        });
    } else {
      this.selectedValue = newValue;
    }
  }

  public showDialog(newValue: any): any {
    return this.dialogService.showDialog({
      message: 'test',
      actions: [
        {
          handler: () => {
            this.selectComponent.writeValue(this.selectedValue);
          },
          text: 'cancel'
        },
        {
          handler: () => {
            this.selectedValue = newValue;
          },
          text: 'ok'
        }
      ]
    });
  }
}
