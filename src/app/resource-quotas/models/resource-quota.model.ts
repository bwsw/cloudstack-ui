import { BaseModel, ResourceType } from '../../shared/models';

export interface ResourceQuota extends BaseModel {
  resourceType: number;
  minimum: number;
  maximum: number;
}

export function convertFromLimitToQuotaMeasurement(resourceType: number, value: number): number {
  switch (resourceType) {
    case ResourceType.Memory:
      // MB to GB
      return Math.ceil(value / 1024);
    default:
      return value;
  }
}

export function convertFromQuotaToLimitMeasurement(resourceType: number, value: number): number {
  switch (resourceType) {
    case ResourceType.Memory:
      // GB to MB
      return value * 1024;
    default:
      return value;
  }
}
