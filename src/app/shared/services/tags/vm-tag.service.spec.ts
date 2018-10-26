// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { TestBed } from '@angular/core/testing';
//
// import { vm } from '../../../../testutils/data';
// import { TagService } from '../../../shared/services/tags/tag.service';
// import { VmTagService } from './vm-tag.service';
// import { DescriptionTagService } from './description-tag.service';
// import { Color } from '../../models';
// import { Store } from '@ngrx/store';
// import { TestStore } from '../../../../testutils/ngrx-test-store';
// import { AsyncJobService } from '../async-job.service';
//
// describe('VM creation security group service', () => {
//   let tagService: VmTagService;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         DescriptionTagService,
//         TagService,
//         AsyncJobService,
//         VmTagService,
//         { provide: Store, useClass: TestStore },
//       ],
//       imports: [HttpClientTestingModule],
//     });
//     tagService = TestBed.get(VmTagService);
//   });
//
//   it('should return default color', () => {
//     const result = tagService.getColorSync(vm);
//     const defaultColor: Color = new Color('white', '#FFFFFF', '');
//     expect(result.name).toBe(defaultColor.name);
//   });
// });
