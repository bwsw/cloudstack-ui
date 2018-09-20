interface EntityDecoratorData<M> {
  entity: string;
  entityModel?: { new(params?): M };
}

export function BackendResource<T>(data: EntityDecoratorData<T>): ClassDecorator {
  return function<M extends Function>(target: M): typeof target {
    target.prototype.entity = data.entity;
    target.prototype.entityModel = data.entityModel;

    return target;
  };
}
