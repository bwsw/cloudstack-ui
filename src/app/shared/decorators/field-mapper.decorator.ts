// tslint:disable-next-line:function-name
export function FieldMapper(data: {}): ClassDecorator {
  return function<T extends Function>(target: T): typeof target {
    const mapper = target.prototype.mapper;
    if (mapper) {
      // tslint:disable-next-line:no-parameter-reassignment
      data = {...mapper, ...data};
    }
    target.prototype.mapper = data;

    return target;
  };
}
