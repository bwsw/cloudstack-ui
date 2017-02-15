export function FieldMapper(data: {}): ClassDecorator {
  return function (target: Function): typeof target {
    target.prototype._mapper = data;

    return target;
  };
}
