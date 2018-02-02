export interface Action<M> {
  name: string;
  command: string | number;
  icon: string;
  canActivate: (m: M) => boolean;
  confirmMessage?: string;
}
