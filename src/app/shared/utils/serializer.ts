import pickBy from 'lodash/pickBy';
import assign from 'lodash/assign';

export interface FilterConfig {
  [propName: string]: FilterItemConfig;
}

export interface FilterItemConfig {
  type: 'array' | 'string' | 'boolean';
  options?: any[];
  defaultOption?: any;
}

export class Serializer {
  public static encode(params): Object {
    return Object.keys(params).reduce((memo, field) => {
      if (params.hasOwnProperty(field)) {
        const val = params[field];
        if (!Array.isArray(val) || val.length) {
          memo[field] = val;
        }
        return memo;
      }
    }, {});
  }

  public static decode(encodedObjects, config: FilterConfig): Object {
    const keys = Object.keys(config);

    debugger;

    const parsedObjects = encodedObjects.map(encodedObject => {
      return keys.reduce(
        (memo, filter) => ({
          ...memo,
          [filter]: Serializer.getValue(encodedObject[filter], config[filter]),
        }),
        {},
      );
    });

    const defaultValues = keys.reduce(
      (memo, filter) => ({
        ...memo,
        [filter]: config[filter].defaultOption,
      }),
      {},
    );

    const merged = assign(...parsedObjects, defaultValues);

    return pickBy(merged, Boolean);
  }

  private static getValue(param, conf: FilterItemConfig): any {
    let res;
    if (param != null) {
      switch (conf.type) {
        case 'boolean':
          if (typeof param === 'boolean' || param === 'true' || param === 'false') {
            res = JSON.parse(param);
          }
          break;
        case 'string':
          if (!conf.options || conf.options.some(_ => _ === param)) {
            res = param.toString();
          }
          break;
        case 'array':
          let par = param;
          if (typeof param === 'string') {
            par = param.split(',');
          } else if (!Array.isArray(param)) {
            break;
          }
          res = !conf.options ? par : par.filter(p => conf.options.some(_ => _ === p));
          break;
        default:
          break;
      }
    }
    return res;
  }
}
