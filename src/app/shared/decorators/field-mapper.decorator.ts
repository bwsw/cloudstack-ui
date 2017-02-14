export function FieldMapper(data: {}): ClassDecorator {
  return function (target: Function) {
    target.prototype._mapper = data;

    return target;
  };
}
