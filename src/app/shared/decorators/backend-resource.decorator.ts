interface EntityDecoratorData<M> {
  entity: string;
}

// tslint:disable-next-line:function-name
export function BackendResource<T>(data: EntityDecoratorData<T>): ClassDecorator {
  return function<M extends Function>(target: M): typeof target {
    target.prototype.entity = data.entity;

    return target;
  };
}
