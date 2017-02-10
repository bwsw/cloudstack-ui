import { Component, OnInit, EventEmitter, Output, forwardRef } from '@angular/core';
import { OsFamily } from '../../shared/models/os-type.model';
import { Subject } from 'rxjs';
import { StorageService } from '../../shared/services/storage.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'cs-template-filters',
  templateUrl: 'template-filters.component.html',
  styleUrls: ['template-filters.component.scss']
})
export class TemplateFiltersComponent implements OnInit {
  @Output() public queries = new EventEmitter();
  @Output() public displayMode = new EventEmitter();
  @Output() public filters = new EventEmitter();

  public showIso: boolean = false;
  public query: string;
  public selectedOsFamilies: Array<OsFamily>;
  public selectedFilters: Array<string>;
  public filterTranslations: {};

  public osFamilies: Array<OsFamily> = [
    'Linux',
    'Windows',
    'Mac OS',
    'Other'
  ];

  public categoryFilters = [
    'featured',
    'self'
  ];

  private queryStream = new Subject<string>();

  constructor(
    private storageService: StorageService,
    private translateService: TranslateService
  ) { }

  public ngOnInit(): void {
    this.selectedOsFamilies = this.osFamilies.concat();
    this.selectedFilters = this.categoryFilters.concat();
    this.updateFilters();

    this.queryStream
      .distinctUntilChanged()
      .subscribe(query => {
        this.queries.emit(query);
      });

    this.showIso = this.storageService.read('templateDisplayMode') === 'iso';
    this.updateDisplayMode();

    this.translateService.get(
      this.categoryFilters.map(filter => `TEMPLATE_${filter.toUpperCase()}`)
    )
      .subscribe(translations => {
        const strs = {};
        this.categoryFilters.forEach(f => {
          strs[f] = translations[`TEMPLATE_${f.toUpperCase()}`];
        });
        this.filterTranslations = strs;
      });
  }

  public updateFilters(): void {
    this.filters.emit({
      selectedOsFamilies: this.selectedOsFamilies,
      selectedFilters: this.selectedFilters,
      query: this.query
    });
  }

  public search(e: KeyboardEvent): void {
    this.queryStream.next((e.target as HTMLInputElement).value);
  }

  private updateDisplayMode(): void {
    this.displayMode.emit(this.showIso);
    this.storageService.write('templateDisplayMode', this.showIso ? 'iso' : 'template');
  }
}
