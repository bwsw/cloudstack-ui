import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  public filterData: any;
  public viewMode: SecurityGroupViewMode;

  constructor(
    private securityGroupService: SecurityGroupService,
    private listService: ListService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService
  ) {
    this.securityGroupService.onSecurityGroupUpdate.subscribe(updatedGroup => {
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
    this.viewMode =
      this.storageService.read('securityGroupDisplayMode') as SecurityGroupViewMode
      || SecurityGroupViewMode.Templates;

    this.update();

    this.securityGroupService.onSecurityGroupDeleted.subscribe(securityGroup => {
      this.customSecurityGroupList = this.customSecurityGroupList
        .filter(sg => {
          return sg.id !== securityGroup.id;
        });

      this.sharedSecurityGroupList = this.sharedSecurityGroupList
        .filter(sg => {
          return sg.id !== securityGroup.id;
        });
    });
  }

  public get loaded(): boolean {
    return !!this.predefinedSecurityGroupList
      && !!this.customSecurityGroupList
      && !!this.sharedSecurityGroupList;
  }

  public get isViewModeTemplates(): boolean {
    return this.viewMode === SecurityGroupViewMode.Templates;
  }

  public get isViewModeShared(): boolean {
    return this.viewMode === SecurityGroupViewMode.Shared;
  }

  public updateFiltersAndFilter(filterData: any): void {
    this.filterData = filterData;
    this.filter();
  }

  public filter(): void {
    if (this.filterData.viewMode) {
      this.viewMode = this.filterData.viewMode;
    }
  }

  public showCreationDialog(): void {
    this.listService.onUpdate.subscribe(() => {
      this.update();
    });

    this.router.navigate(['./create'], {
      preserveQueryParams: true,
      relativeTo: this.activatedRoute
    });
  }

  private update(): void {
    this.predefinedSecurityGroupList = this.securityGroupService.getTemplates();
    this.securityGroupService.getList().subscribe(securityGroups => {
      this.customSecurityGroupList = securityGroups.filter(securityGroup => {
        return securityGroup.type === SecurityGroupType.CustomTemplate;
      });

      this.sharedSecurityGroupList = securityGroups.filter(securityGroup => {
        return securityGroup.type === SecurityGroupType.Shared;
      });
    });
  }
}
