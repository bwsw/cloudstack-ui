import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterConfig, FilterService } from './filter.service';
import { RouterUtilsService } from './router-utils.service';
import { LocalStorageService } from './local-storage.service';
import { TagService } from './tags/tag.service';
import { MemoryStorageService } from './memory-storage.service';

describe('Filter service', () => {
  const testKey = 'testKey';

  class RouterStub {
    public navigate(): Promise<any> {
      return Promise.resolve();
    }
  }

  class ActivateRouteStub {
    private testParams: {};

    get snapshot(): {} {
      return { queryParams: this.testParams };
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useClass: ActivateRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: TagService, useValue: {} },
        {
          provide: RouterUtilsService,
          useValue: {
            getRouteWithoutQueryParams: _ => _,
          },
        },
        MemoryStorageService,
        LocalStorageService,
      ],
    });
  }));

  it('should update filters', fakeAsync(
    inject([ActivatedRoute, Router, LocalStorageService], (activatedRoute, router, storage) => {
      const filterService = new FilterService({}, router, storage, testKey, activatedRoute);
      const params = { asd: 4, dsa: 5 };
      filterService.update(params);
      tick(5);
      expect(storage.read(testKey)).toBe(JSON.stringify(params));
    }),
  ));

  it('should not put empty arrays', fakeAsync(
    inject([ActivatedRoute, Router, LocalStorageService], (activatedRoute, router, storage) => {
      const filterService = new FilterService({}, router, storage, testKey, activatedRoute);
      const params = { asd: [], dsa: [5] };
      filterService.update(params);
      tick(5);
      expect(storage.read(testKey)).toBe(JSON.stringify({ dsa: [5] }));
    }),
  ));

  it("should handle type 'boolean' correctly", inject(
    [ActivatedRoute, Router, LocalStorageService],
    (activatedRoute, router, storage) => {
      const whiteList: FilterConfig = {
        filterBool: { type: 'boolean' },
        filterBool1: { type: 'boolean' },
        filterBool2: { type: 'boolean' },
        filterBool3: { type: 'boolean' },
        filterBool4: { type: 'boolean' },
      };
      const filterService = new FilterService(whiteList, router, storage, testKey, activatedRoute);
      activatedRoute.testParams = {
        filterBool: true,
        filterBool1: false,
        filterBool2: 'true',
        filterBool3: 'false',
        filterBool4: 'notABoolean',
      };
      const filters = filterService.getParams();
      expect(filters.filterBool).toBe(true);
      expect(filters.filterBool1).toBe(false);
      expect(filters.filterBool2).toBe(true);
      expect(filters.filterBool3).toBe(false);
      expect(filters.filterBool4).toBeUndefined();
    },
  ));

  it("should handle type 'string' correctly", inject(
    [ActivatedRoute, Router, LocalStorageService],
    (activatedRoute, router, storage) => {
      const whiteList: FilterConfig = {
        filterString: { type: 'string' },
        filterString1: {
          type: 'string',
          options: ['filter1', 'filter2'],
        },
        filterString2: {
          type: 'string',
          options: ['filter1', 'filter2'],
          defaultOption: 'filter1',
        },
        filterString3: {
          type: 'string',
          options: ['filter1', 'filter2'],
        },
      };

      const testParams = {
        filterString: 'anyValue',
        filterString1: 'notFromOptions',
        filterString2: 'shouldFallbackToDefaultOption',
        filterString3: whiteList['filterString3'].options[0],
      };

      activatedRoute.testParams = testParams;
      const filterService = new FilterService(whiteList, router, storage, testKey, activatedRoute);

      const filters = filterService.getParams();
      expect(filters.filterString).toBe(testParams.filterString);
      expect(filters.filterString1).toBeUndefined();
      expect(filters.filterString2).toBe(whiteList['filterString2'].defaultOption);
      expect(filters.filterString3).toBe(testParams.filterString3);
    },
  ));

  it("should handle type 'array' correctly", inject(
    [ActivatedRoute, Router, LocalStorageService],
    (activatedRoute, router, storage) => {
      const whiteList: FilterConfig = {
        serializedArray: { type: 'array' },
        array: { type: 'array' },
        withOptions: {
          type: 'array',
          options: ['option1', 'option2'],
        },
        intersection: {
          type: 'array',
          options: ['option1', 'option2'],
        },
        unknownValue: {
          type: 'array',
          options: ['option1', 'option2'],
        },
        notAnArray: {
          type: 'array',
        },
      };

      activatedRoute.testParams = {
        serializedArray: 'anyValue,anotherValue',
        array: ['anyValue', 'anotherValue'],
        withOptions: 'option2',
        intersection: 'option2,option3',
        unknownValue: 'option3',
        notAnArray: 123,
      };

      const filterService = new FilterService(whiteList, router, storage, testKey, activatedRoute);

      const filters = filterService.getParams();
      expect(filters.serializedArray).toEqual(['anyValue', 'anotherValue']);
      expect(filters.array).toEqual(['anyValue', 'anotherValue']);
      expect(filters.withOptions).toEqual(['option2']);
      expect(filters.notAnArray).toBeUndefined();
      expect(filters.intersection).toEqual(['option2']);
    },
  ));

  it('should not return missing filters', inject(
    [ActivatedRoute, Router, LocalStorageService],
    (activatedRoute, router, storage) => {
      const whiteList: FilterConfig = {
        filter1: {
          type: 'string',
        },
        filter2: {
          type: 'array',
        },
      };

      const queryParams = { filter1: 'privet' };
      activatedRoute.testParams = queryParams;

      const filterService = new FilterService(whiteList, router, storage, testKey, activatedRoute);

      const filters = filterService.getParams();
      expect(filters).toEqual(queryParams);
    },
  ));

  it('should create missing filters from localStorage', inject(
    [ActivatedRoute, Router, LocalStorageService],
    (activatedRoute, router, storage) => {
      const whiteList: FilterConfig = {
        filter1: {
          type: 'string',
        },
        filter2: {
          type: 'array',
        },
      };

      const queryParams = { filter1: 'privet' };
      const storageFilters = { filter2: ['asd', 'dsa'] };
      storage.write(testKey, JSON.stringify(storageFilters));
      activatedRoute.testParams = queryParams;
      const filterService = new FilterService(whiteList, router, storage, testKey, activatedRoute);

      const filters = filterService.getParams();
      expect(filters).toEqual({ ...queryParams, ...storageFilters });
    },
  ));

  it('should ignore invalid JSON from localStorage', inject(
    [ActivatedRoute, Router, LocalStorageService],
    (activatedRoute, router, storage) => {
      const whiteList: FilterConfig = {
        filter1: {
          type: 'string',
        },
        filter2: {
          type: 'array',
        },
      };

      const queryParams = { filter1: 'privet' };
      storage.write(testKey, 'invalidJSON');
      activatedRoute.testParams = queryParams;
      const filterService = new FilterService(whiteList, router, storage, testKey, activatedRoute);

      const filters = filterService.getParams();
      expect(filters).toEqual(queryParams);
      expect(storage.read(testKey)).toBeNull();
    },
  ));

  it('should return default option if requested filter is not present in url or localStorage', inject(
    [ActivatedRoute, Router, LocalStorageService],
    (activatedRoute, router, storage) => {
      const whiteList: FilterConfig = {
        filter: { type: 'string', defaultOption: 'default' },
      };

      localStorage.setItem(testKey, JSON.stringify({ asd: 5 }));
      activatedRoute.testParams = { unknownFilter: 5 };
      const filterService = new FilterService(whiteList, router, storage, testKey, activatedRoute);

      const filters = filterService.getParams();
      expect(filters).toEqual({ filter: 'default' });
    },
  ));

  it('should not lookup localStorage if all params are set in the url', inject(
    [ActivatedRoute, Router, LocalStorageService],
    (activatedRoute, router, storage) => {
      const whiteList: FilterConfig = {
        filter: { type: 'string', defaultOption: 'default' },
        filter1: { type: 'boolean' },
      };

      localStorage.setItem(
        testKey,
        JSON.stringify({
          filter: 'fromStorage',
          filter1: false,
        }),
      );
      const urlParams = {
        filter: 'fromUrl',
        filter1: true,
      };
      activatedRoute.testParams = urlParams;
      const filterService = new FilterService(whiteList, router, storage, testKey, activatedRoute);

      const filters = filterService.getParams();
      expect(filters).toEqual(urlParams);
    },
  ));
});
