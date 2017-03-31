export function Sort(field: string, comparator?: (a: any, b: any) => number): ClassDecorator {
  return function (target: Function): typeof target {
    const fieldName = 'sortBy' + (field.charAt(0).toUpperCase() + field.slice(1));
    const comp = comparator ||
      ((a, b) => {
        if (a[field] < b[field]) {
          return -1;
        }
        if (a[field] > b[field]) {
          return 1;
        }
        return 0;
      });

    target[fieldName] = function(array: Array<typeof target>): Array<typeof target> {
      return array.sort(comp);
    };
    return target;
  };
}
