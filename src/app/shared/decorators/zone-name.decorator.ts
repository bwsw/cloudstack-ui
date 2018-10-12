export function ZoneName(): ClassDecorator {
  return function<T extends Function>(target: T): typeof target {
    Object.defineProperty(target.prototype, 'nameWithZone', {
      get: function(): string {
        return `${this.zonename} / ${this.name}`;
      },
      enumerable: true,
      configurable: true
    });
    return target;
  };
}
