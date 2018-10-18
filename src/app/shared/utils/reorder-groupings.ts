import { Grouping } from '../models';

export function reorderAvailableGroupings(
  availableGroupings: Grouping[],
  selectedGroupings: Grouping[],
): Grouping[] {
  const selectedKeys = selectedGroupings.map(el => el.key);
  const notSelected = availableGroupings.filter(el => !selectedKeys.includes(el.key));
  return [...selectedGroupings, ...notSelected];
}
