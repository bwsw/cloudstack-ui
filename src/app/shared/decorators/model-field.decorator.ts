export const CloudStackMetadataKey = 'cloudstack-ui';
export const AvailableFieldsMetadataKey = 'cloudstack-ui:fields';

export function ModelField(name?: string) {
  return (target: Object, propertyKey: string) => {
    // define metadata using name or property key if name is not specified
    Reflect.defineMetadata(CloudStackMetadataKey, name || propertyKey, target, propertyKey);

    let availableFields = Reflect.getMetadata(AvailableFieldsMetadataKey, target);
    if (!availableFields) {
      availableFields = [];
      Reflect.defineMetadata(AvailableFieldsMetadataKey, availableFields, target);
    }
    availableFields.push(propertyKey);
  };
}
