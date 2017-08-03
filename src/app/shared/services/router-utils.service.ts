import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';


@Injectable()
export class RouterUtilsService {
  constructor(
    private platformLocation: PlatformLocation,
  ) {}

  public getBaseHref(): string {
    return this.platformLocation.getBaseHrefFromDOM();
  }
}
