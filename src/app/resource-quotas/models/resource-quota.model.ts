import { BaseModel } from '../../shared/models';

export interface ResourceQuota extends BaseModel {
  id: string;
  domainId: string;
  resourceType: number;
  minimum: number;
  maximum: number;
}
