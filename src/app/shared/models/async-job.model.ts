import { BaseModel } from './base.model';

export interface AsyncJob<T> extends BaseModel {
  jobid: string;
  jobstatus: number;
  jobresultcode: number;
  jobresult: T;
  jobinstancetype: string;
  jobinstanceid?: string;
  jobresulttype: string;
  cmd: string;
}

export const mapCmd = asyncJob => {
  // when a command is executed, two jobs are initiated
  // one has type of "Cmd", another one is "Work"
  // we need only one so we take "Cmd" and filter any others out
  const regex = /^org\.apache\.cloudstack\.api\.command\..*\.vm\.(\w*)Cmd$/;
  if (!asyncJob.cmd) {
    return '';
  }

  const matches = asyncJob.cmd.match(regex);
  if (matches) {
    return this.formatCommand(asyncJob);
  }
  return '';
};

export const formatCommand = asyncJob => {
  const indexOfVmSubstr = asyncJob.cmd.indexOf('vm');
  if (indexOfVmSubstr !== -1) {
    return asyncJob.cmd.substring(0, asyncJob.cmd.length - 2);
  }
  return asyncJob.cmd;
};
