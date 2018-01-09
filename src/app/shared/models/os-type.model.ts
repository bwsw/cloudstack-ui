import { BaseModelInterface } from './base.model';

export enum OsFamily {
  Linux = 'Linux',
  Windows = 'Windows',
  MacOs = 'Mac OS',
  Other = 'Other'
}

export interface OsType extends BaseModelInterface {
  id: string;
  description: string;
  isuserdefined: boolean;
  oscategory: string;

  osFamily: OsFamily;
}
