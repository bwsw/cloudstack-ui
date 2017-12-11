import { BaseModelInterface } from './base.model';

export interface Grouping {
  key: string,
  label: string,
  selector: (item: BaseModelInterface) => any,
  name: (item: BaseModelInterface) => string
}
