import * as pickBy from 'lodash/pickBy';

const removeNullsAndEmptyArrays = object =>
  pickBy(object, value => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value != null;
  });

export default removeNullsAndEmptyArrays;
