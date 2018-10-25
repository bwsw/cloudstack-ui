export function filterWithPredicates<M>(values: M[], predicates: ((m: M) => boolean)[]): M[] {
  return values.filter(value => predicates.every(predicate => predicate(value)));
}
