interface EntityDecoratorData<M> {
  entity: string;
}

export function BackendResource<T>(data: EntityDecoratorData<T>): ClassDecorator {
  return function<M extends Function>(target: M): typeof target {
    target.prototype.entity = data.entity;

    return target;
  };
}
