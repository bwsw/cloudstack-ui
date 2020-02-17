import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cs-insufficient-resources',
  templateUrl: './insufficient-resources.component.html',
  styleUrls: ['./insufficient-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsufficientResourcesComponent {
  @Input()
  set insufficientResources(value: string[]) {
    this._resources = new Set<string>(value || []);
  }

  get resources(): Set<string> {
    return this._resources;
  }

  get noInstances() {
    return this._resources.has('instances');
  }

  get noMaxInstances() {
    return this._resources.has('max_instances');
  }

  public readonly insufficientResourcesErrorMap = {
    ips: 'VM_PAGE.VM_CREATION.IPS',
    volumes: 'VM_PAGE.VM_CREATION.VOLUMES',
    cpus: 'VM_PAGE.VM_CREATION.CPUS',
    memory: 'VM_PAGE.VM_CREATION.MEMORY',
    primaryStorage: 'VM_PAGE.VM_CREATION.PRIMARY_STORAGE',
  };

  private _resources = new Set<string>();
}
