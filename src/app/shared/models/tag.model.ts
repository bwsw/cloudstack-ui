import { BaseModelInterface } from './base.model';

export const ResourceTypes = {
  USER: 'User',
  VM: 'UserVm'
};

export const DeletionMark = {
  TAG: 'status',
  VALUE: 'removed'
};

export const defaultCategoryName = 'Common';

// Get rid of BaseModel interface, tags does not have id
export interface Tag extends BaseModelInterface {
  account?: string;
  domain?: string;
  domainid?: string;
  key: string;
  resourceid?: string;
  resourcetype?: string;
  value: string;
}

export const categoryName = (tag: Tag): string => {
  const tagParts = tag.key.split('.');
  const categoryNameIsPresent = tagParts.length > 1 && tagParts[0] && tagParts[1];

  return categoryNameIsPresent ? tagParts[0] : defaultCategoryName;
};

export const keyWithoutCategory = (tag: Tag): string => {
  if (categoryName(tag) === defaultCategoryName) {
    return tag.key;
  }

  return tag.key.split('.').splice(1).join('.');
};
