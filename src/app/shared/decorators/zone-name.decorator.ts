export function ZoneName(): ClassDecorator {
  return function (target: Function): typeof target {
    Object.defineProperty(target.prototype, 'nameWithZone', {
      get: function(): string {
        return `${this.zoneName} / ${this.name}`;
      },
      enumerable: true,
      configurable: true
    });
    return target;
  };
}
