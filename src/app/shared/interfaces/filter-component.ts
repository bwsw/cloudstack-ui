import { EventEmitter } from '@angular/core';

export interface FilterComponent<FilterData> {
  updateFilters: EventEmitter<FilterData>;
  initFilters(): void;
  update(): void;
}
