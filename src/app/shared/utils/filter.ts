export function filterWithPredicates<M>(values: Array<M>, predicates: Array<(m: M) => boolean>): Array<M> {
  return values.filter(value => predicates.every(predicate => predicate(value)));
}
