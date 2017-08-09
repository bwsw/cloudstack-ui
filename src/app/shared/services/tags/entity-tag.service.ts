import { Injectable } from '@angular/core';
import { TagService } from './tag.service';


@Injectable()
export abstract class EntityTagService {
  public keys: any;
  public abstract entityPrefix: string;
  protected globalPrefix = 'csui';

  constructor(protected tagService: TagService) {}

  protected initKeys(): void {
    this.keys = this.getPrefixedKeys(this.keys);
  }

  private getPrefixedKeys(keys: any): any {
    return Object.keys(keys).reduce((acc, key) => {
      return Object.assign(
        acc, {
        [key]: this.getPrefixedKey(key)
      });
    }, {});
  }

  private getPrefixedKey(key: string): string {
    return `${this.globalPrefix}.${this.entityPrefix}.${key}`;
  }
}
