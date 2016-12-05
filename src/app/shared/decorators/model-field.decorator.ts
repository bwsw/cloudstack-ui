export const CLOUDSTACK_METADATA_KEY = 'cloudstack-ui';
export const AVAILABLE_FIELDS_METADATA_KEY = 'cloudstack-ui:fields';

export function ModelField(name?: string) {
  return (target: Object, propertyKey: string) => {
    // define metadata using name or property key if name is not specified
    Reflect.defineMetadata(CLOUDSTACK_METADATA_KEY, name || propertyKey, target, propertyKey);

    let availableFields = Reflect.getMetadata(AVAILABLE_FIELDS_METADATA_KEY, target);
    if (!availableFields) {
      availableFields = [];
      Reflect.defineMetadata(AVAILABLE_FIELDS_METADATA_KEY, availableFields, target);
    }
    availableFields.push(propertyKey);
  };
}
