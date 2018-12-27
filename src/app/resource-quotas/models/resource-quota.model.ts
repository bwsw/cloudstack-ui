import { BaseModel } from '../../shared/models';

export interface ResourceQuota extends BaseModel {
  resourceType: number;
  minimum: number;
  maximum: number;
}
