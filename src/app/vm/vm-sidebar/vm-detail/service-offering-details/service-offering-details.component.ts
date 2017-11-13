import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import { ServiceOffering } from '../../../../shared/models/service-offering.model';
import { ServiceOfferingService } from '../../../../shared/services/service-offering.service';
import { ServiceOfferingDialogComponent } from '../../../../service-offering/service-offering-dialog/service-offering-dialog.component';


@Component({
  selector: 'cs-service-offering-details',
  templateUrl: 'service-offering-details.component.html',
  styleUrls: ['service-offering-details.component.scss']
})
export class ServiceOfferingDetailsComponent {
  @Input() public offering: ServiceOffering;
  @Output() public onOfferingChange = new EventEmitter();

  public expandServiceOffering: boolean;

  constructor(
    private dialog: MatDialog,
    private serviceOfferingService: ServiceOfferingService
  ) {
    this.expandServiceOffering = false;
  }

  public changeServiceOffering(): void {
    this.dialog.open(ServiceOfferingDialogComponent, <MatDialogConfig>{
      width: '350px',
      disableClose: true
    })
      .afterClosed()
      .subscribe((newOffering: ServiceOffering) => {
        if (newOffering) {
          this.onOfferingChange.emit(newOffering);
        }
      });
  }

  public toggleServiceOffering(): void {
    this.expandServiceOffering = !this.expandServiceOffering;
  }
}
