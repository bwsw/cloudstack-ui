export interface Action<M> {
  name: string;
  command: string;
  icon: string;
  canActivate: (m: M) => boolean;
  confirmMessage?: string;
}
