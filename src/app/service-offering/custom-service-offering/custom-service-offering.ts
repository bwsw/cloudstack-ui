import { ServiceOffering } from '../../shared/models';


export class CustomServiceOffering extends ServiceOffering {
  public cpuNumber: number;
  public cpuSpeed: number;
  public memory: number;

  constructor(params: {
    cpuNumber?: number,
    cpuSpeed?: number,
    memory?: number,
    serviceOffering: ServiceOffering
  }) {
    super(params.serviceOffering);
    this.cpuNumber = params.cpuNumber;
    this.cpuSpeed = params.cpuSpeed;
    this.memory = params.memory;
  }

  public get areCustomParamsSet(): boolean {
    return [this.cpuNumber, this.cpuSpeed, this.memory].every(el => el !== undefined);
  }
}
