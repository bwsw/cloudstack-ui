import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { ListService } from '../../shared/components/list/list.service';
import { UserTagService } from '../../shared/services/tags/user-tag.service';
import { VirtualMachine } from '../shared/vm.model';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';


@Component({
  selector: 'cs-vm-page',
  templateUrl: 'vm-page.component.html',
  styleUrls: ['vm-page.component.scss'],
  providers: [ListService]
})
export class VmPageComponent implements OnInit {
  @Input() public vms: Array<VirtualMachine>;
  @Input() public isLoading: boolean;
  @Input() public groupings: Array<any>;
  @Input() public selectedGroupings: Array<any>;

  public mode: ViewMode;
  public viewModeKey = 'vmPageViewMode';

  constructor(
    public listService: ListService,
    private dialogService: DialogService,
    private userTagService: UserTagService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    if (this.vms.length && this.shouldShowSuggestionDialog) {
      this.showSuggestionDialog();
    }
  }

  public changeMode(mode) {
    this.mode = mode;
  }

  public showVmCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

  private get shouldShowSuggestionDialog(): boolean {
    return !this.vms.length && !this.isCreateVmInUrl;
  }

  private get isCreateVmInUrl(): boolean {
    return (
      this.activatedRoute.children.length &&
      this.activatedRoute.children[0].snapshot.url[0].path === 'create'
    );
  }

  private showSuggestionDialog(): void {
    this.userTagService.getAskToCreateVm().subscribe(tag => {
      if (tag === false) {
        return;
      }

      this.dialogService.askDialog({
        message: 'SUGGESTION_DIALOG.WOULD_YOU_LIKE_TO_CREATE_VM',
        actions: [
          {
            handler: () => this.showVmCreationDialog(),
            text: 'COMMON.YES'
          },
          {
            text: 'COMMON.NO'
          },
          {
            handler: () => this.userTagService.setAskToCreateVm(false).subscribe(),
            text: 'SUGGESTION_DIALOG.NO_DONT_ASK'
          }
        ],
        disableClose: false,
        width: '320px'
      });
    });
  }

}
