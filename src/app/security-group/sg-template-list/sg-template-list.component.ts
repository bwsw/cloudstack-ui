import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ListService } from '../../shared/components/list/list.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { SecurityGroupService } from '../services/security-group.service';
import { SecurityGroupViewMode } from '../sg-filter/sg-filter.component';
import { SecurityGroup, SecurityGroupType } from '../sg.model';


@Component({
  selector: 'cs-security-group-template-list',
  templateUrl: 'sg-template-list.component.html',
  styleUrls: ['sg-template-list.component.scss'],
  providers: [ListService]
})
export class SgTemplateListComponent implements OnInit {
  public predefinedSecurityGroupList: Array<SecurityGroup>;
  public customSecurityGroupList: Array<SecurityGroup>;
  public sharedSecurityGroupList: Array<SecurityGroup>;

  public visiblePredefinedSecurityGroupList: Array<SecurityGroup>;
  public visibleCustomSecurityGroupList: Array<SecurityGroup>;
  public visibleSharedSecurityGroupList: Array<SecurityGroup>;

  public filterData: any;
  public query: string;
  public viewMode: SecurityGroupViewMode;

  constructor(
    private cd: ChangeDetectorRef,
    private securityGroupService: SecurityGroupService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService
  ) {
    this.securityGroupService.onSecurityGroupCreated
      .switchMap(() => {
        return this.loadGroups();
      })
      .subscribe();

    this.securityGroupService.onSecurityGroupUpdate
      .subscribe(updatedGroup => {
        this.customSecurityGroupList = this.customSecurityGroupList.map(group => {
          if (group.id === updatedGroup.id) {
            return updatedGroup;
          } else {
            return group;
          }
        });
      });
  }

  public ngOnInit(): void {
    this.setViewMode();
    this.subscribeToSecurityGroupDeletions();
    this.loadGroups().subscribe();
  }

  public get loaded(): boolean {
    return !!this.visiblePredefinedSecurityGroupList
      && !!this.visibleCustomSecurityGroupList
      && !!this.visibleSharedSecurityGroupList;
  }

  public get isViewModeTemplates(): boolean {
    return this.viewMode === SecurityGroupViewMode.Templates;
  }

  public get isViewModeShared(): boolean {
    return this.viewMode === SecurityGroupViewMode.Shared;
  }

  public get templateSecurityGroupPageHasItems(): boolean {
    return (
      !!this.visiblePredefinedSecurityGroupList.length ||
      !!this.visibleCustomSecurityGroupList.length
    );
  }

  public get sharedSecurityGroupPageHasItems(): boolean {
    return !!this.visibleSharedSecurityGroupList.length;
  }

  public updateFiltersAndFilter(filterData: any): void {
    this.filterData = filterData;
    this.filter();
  }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

  private setViewMode(): void {
    this.viewMode =
      this.storageService.read('securityGroupDisplayMode') as SecurityGroupViewMode
      || SecurityGroupViewMode.Templates;

    this.cd.detectChanges();
  }

  private loadGroups(): Observable<void> {
    this.predefinedSecurityGroupList = this.securityGroupService.getPredefinedTemplates();
    return this.securityGroupService.getList()
      .map(securityGroups => {
        this.customSecurityGroupList = securityGroups.filter(securityGroup => {
          return securityGroup.type === SecurityGroupType.CustomTemplate;
        });

        this.sharedSecurityGroupList = securityGroups.filter(securityGroup => {
          return securityGroup.type === SecurityGroupType.Shared;
        });
      })
      .map(() => this.filter());
  }

  private filter(): void {
    if (this.filterData) {
      if (this.filterData.viewMode) {
        this.viewMode = this.filterData.viewMode;
      }

      this.query = this.filterData.query;
    }

    this.filterPredefinedSecurityGroups();
    this.filterCustomSecurityGroups();
    this.filterSharedSecurityGroups()
  }

  private filterPredefinedSecurityGroups(): void {
    if (this.predefinedSecurityGroupList) {
      this.visiblePredefinedSecurityGroupList = this.predefinedSecurityGroupList
        .filter(securityGroup => {
          return this.doesSecurityGroupIncludeQuery(securityGroup);
        });
    }
  }

  private filterCustomSecurityGroups(): void {
    if (this.customSecurityGroupList) {
      this.visibleCustomSecurityGroupList = this.customSecurityGroupList
        .filter(securityGroup => {
          return this.doesSecurityGroupIncludeQuery(securityGroup);
        });
    }
  }

  private filterSharedSecurityGroups(): void {
    if (this.sharedSecurityGroupList) {
      this.visibleSharedSecurityGroupList = this.sharedSecurityGroupList
        .filter(securityGroup => {
          return this.doesSecurityGroupIncludeQuery(securityGroup);
        });
    }
  }

  private doesSecurityGroupIncludeQuery(securityGroup: SecurityGroup): boolean {
    if (!this.query) {
      return true;
    }

    const nameIncludesQuery = securityGroup.name
      .toLowerCase()
      .includes(this.query.toLowerCase());

    const descriptionIncludesQuery = securityGroup.description &&
      securityGroup.description
        .toLowerCase()
        .includes(this.query.toLowerCase());

    return nameIncludesQuery || descriptionIncludesQuery;
  }

  private subscribeToSecurityGroupDeletions(): void {
    this.securityGroupService.onSecurityGroupDeleted
      .subscribe(securityGroup => {
        this.customSecurityGroupList = this.customSecurityGroupList
          .filter(sg => {
            return sg.id !== securityGroup.id;
          });

        this.sharedSecurityGroupList = this.sharedSecurityGroupList
          .filter(sg => {
            return sg.id !== securityGroup.id;
          });

        this.filter();
      });
  }
}
