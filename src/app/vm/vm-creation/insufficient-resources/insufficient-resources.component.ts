import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cs-insufficient-resources',
  templateUrl: './insufficient-resources.component.html',
  styleUrls: ['./insufficient-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsufficientResourcesComponent {
  @Input() public insufficientResources: string[];

  public readonly insufficientResourcesErrorMap = {
    instances: 'VM_PAGE.VM_CREATION.INSTANCES',
    ips: 'VM_PAGE.VM_CREATION.IPS',
    volumes: 'VM_PAGE.VM_CREATION.VOLUMES',
    cpus: 'VM_PAGE.VM_CREATION.CPUS',
    memory: 'VM_PAGE.VM_CREATION.MEMORY',
    primaryStorage: 'VM_PAGE.VM_CREATION.PRIMARY_STORAGE',
  };
}
