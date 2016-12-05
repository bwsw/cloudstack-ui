import { AVAILABLE_FIELDS_METADATA_KEY, CLOUDSTACK_METADATA_KEY } from '../decorators/model-field.decorator';

export abstract class BaseModel {
  constructor(params?: {}) {
    if (params) {
      this.parse(params);
    }
  }

  public serialize(params?: {}) {
    let obj = params || this;
    let model = {};

    let target = Object.getPrototypeOf(obj);
    let availableNames = Reflect.getMetadata(AVAILABLE_FIELDS_METADATA_KEY, target) as Array<string>;
    availableNames.forEach(propName => {
      let serverName = Reflect.getMetadata(CLOUDSTACK_METADATA_KEY, target, propName);
      if (!serverName) {
        return;
      }

      let clientVal = obj[propName];
      if (clientVal === undefined) {
        return;
      }

      let serverVal = null;
      let propType = Reflect.getMetadata('design:type', target, propName);
      let propTypeServerFields =  Reflect.getMetadata(AVAILABLE_FIELDS_METADATA_KEY, propType.prototype) as [string];
      if (clientVal && propTypeServerFields) {
        serverVal = this.serialize(clientVal);
      } else {
        serverVal = clientVal;
      }
      model[serverName] = serverVal;
    });

    return model;
  }

  protected parse(params: {}) {
    const target = Object.getPrototypeOf(this);

    const availableNames = Reflect.getMetadata(AVAILABLE_FIELDS_METADATA_KEY, target) as [string];
    if (!availableNames) {
      return;
    }

    availableNames.forEach(propName => {
      const serverName = Reflect.getMetadata(CLOUDSTACK_METADATA_KEY, target, propName);
      if (!serverName) {
        return;
      }

      const serverVal = params[serverName];
      if (serverVal === undefined) {
        return;
      }

      let clientVal = null;

      const propType = Reflect.getMetadata('design:type', target, propName);

      const propTypeServerFields =  Reflect.getMetadata(AVAILABLE_FIELDS_METADATA_KEY, propType.prototype) as [string];
      if (propTypeServerFields) {

        clientVal = this.parse(serverVal);
      } else {

        clientVal = serverVal;
      }

      this[propName] = clientVal;
    });

    return this;
  }
}
