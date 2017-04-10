export function FieldMapper(data: {}): ClassDecorator {
  return function (target: Function): typeof target {
    const mapper = target.prototype._mapper;
    if (mapper) {
      data = Object.assign({}, mapper, data);
    }
    target.prototype._mapper = data;

    return target;
  };
}
