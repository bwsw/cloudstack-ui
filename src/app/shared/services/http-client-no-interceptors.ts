import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';

// to make requests without interceptors
// e.g. to non-CS endpoints that don't need CS headers and params
@Injectable()
export class HttpClientNoInterceptors extends HttpClient {
  constructor(handler: HttpBackend) {
    super(handler);
  }
}
