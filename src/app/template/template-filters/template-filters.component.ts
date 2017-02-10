import { Component, OnInit, EventEmitter, Output, forwardRef, Input } from '@angular/core';
import { OsFamily } from '../../shared/models/os-type.model';
import { Subject } from 'rxjs';
import { StorageService } from '../../shared/services/storage.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'cs-template-filters',
  templateUrl: 'template-filters.component.html',
  styleUrls: ['template-filters.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TemplateFiltersComponent),
      multi: true
    }
  ]
})
export class TemplateFiltersComponent implements OnInit, ControlValueAccessor {
  @Output() public queries = new EventEmitter();
  @Output() public displayMode = new EventEmitter();

  public showIso: boolean = false;
  public query: string;
  public selectedOsFamilies: Array<OsFamily>;
  public selectedFilters: Array<string>;
  public filterTranslations: {};
  public _ffff;

  public osFamilies: Array<OsFamily> = [
    'Linux',
    'Windows',
    'Mac OS',
    'Other'
  ];

  public filters = [
    'featured',
    'self'
  ];

  public propagateChange: any = () => {};

  @Input()
  public get ffff() {
    return this._ffff;
  }

  public set ffff(value) {
    this.selectedFilters = value.selectedFilters;
    this.selectedOsFamilies = value.selectedOsFamilies;
    this.propagateChange(value);
  }

  public writeValue(value): void {
    debugger;
    if (value) {
      this.ffff = value;
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched() { }

  private queryStream = new Subject<string>();

  constructor(
    private storageService: StorageService,
    private translateService: TranslateService
  ) { }

  public ngOnInit(): void {
    this.selectedOsFamilies = this.osFamilies.concat();
    this.selectedFilters = this.filters.concat();
    this.ffff = {
      selectedOsFamilies: this.osFamilies.concat(),
      selectedFilters: this.filters.concat()
    };


    this.queryStream
      .distinctUntilChanged()
      .subscribe(query => {
        this.queries.emit(query);
      });

    this.showIso = this.storageService.read('templateDisplayMode') === 'iso';
    this.updateDisplayMode();

    this.translateService.get(
      this.filters.map(filter => `TEMPLATE_${filter.toUpperCase()}`)
    )
      .subscribe(translations => {
        const strs = {};
        this.filters.forEach(filter => {
          strs[filter] = translations[`TEMPLATE_${filter.toUpperCase()}`];
        });
        this.filterTranslations = strs;
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
