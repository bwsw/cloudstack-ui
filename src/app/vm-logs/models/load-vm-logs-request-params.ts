export interface LoadVmLogsRequestParams {
  id: string;
  startdate?: string;
  enddate?: string;
  keywords?: string;
  logfile?: string;
  sort?: string;
  page?: number;
  pagesize?: number;
}

export interface LoadVmLogsScrollRequestParams {
  id: string;
  startdate?: string;
  enddate?: string;
  keywords?: string;
  logfile?: string;
  sort?: string;
  page?: number;
  pagesize?: number;
  scroll: 1;
}
