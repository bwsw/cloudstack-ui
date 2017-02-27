export function ZoneName(): ClassDecorator {
  return function (target: Function): typeof target {
    Object.defineProperty(target.prototype, 'nameWithZone', {
      get: function(): string {
        return `${this.zoneName} / ${this.displayName}`;
      },
      enumerable: true,
      configurable: true
    });
    return target;
  };
}
