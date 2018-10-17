interface ErrorTranslation {
  regex: RegExp;
  translation: string;
}

export class ErrorService {
  private static errorMap: ErrorTranslation[] = [
    {
      regex: /Going from existing size of.*/,
      translation: 'ERRORS.VOLUME.NEW_SIZE_IS_LOWER',
    },
    {
      regex: /Maximum number of resources of type \'primary_storage\'.*/,
      translation: 'ERRORS.VOLUME.PRIMARY_STORAGE_EXCEEDED',
    },
    {
      regex: /The vm with hostName (.*) already exists.*/,
      translation: 'ERRORS.COMMON.THE_NAME_IS_TAKEN',
    },
    {
      regex: /A key pair with name '(.*)' already exists/,
      translation: 'ERRORS.SSH.KEY_PAIR_ALREADY_EXISTS',
    },
    {
      regex: /Unable to find suitable primary storage when creating volume (.*)/,
      translation: 'ERRORS.VOLUME.UNABLE_TO_FIND_PRIMARY_STORAGE',
    },
    {
      regex: /There is other active snapshot tasks on the instance (.*)/,
      translation: 'ERRORS.VOLUME.VOLUME_BUSY',
    },
    {
      regex: /User is not allowed CloudStack login/,
      translation: 'ERRORS.AUTH.INCORRECT_USERNAME',
    },
    {
      regex: /Failed to authenticate user (.*); please provide valid credentials/,
      translation: 'ERRORS.AUTH.INCORRECT_CREDENTIALS',
    },
    {
      regex: /Unable to find the domain from the path \/(.*)\//,
      translation: 'ERRORS.AUTH.INCORRECT_DOMAIN',
    },
    {
      regex: /Value greater than max allowed length (\d+) for param: volumeName/,
      translation: 'ERRORS.VOLUME.NAME_TOO_LONG',
    },
    {
      regex: /maxSnaps exceeds limit: (\d+) for interval type: hourly/,
      translation: 'ERRORS.SNAPSHOT_POLICIES.HOURLY_TURN_OFF',
    },
    {
      regex: /User (.*) .*or their account.* in domain (.*) is disabled\/locked. Please contact the administrator./,
      translation: 'ERRORS.AUTH.DISABLED',
    },
  ];

  public static parseError(error: any): any {
    const err = ErrorService.errorMap.find(_ => _.regex.test(error.errortext));
    if (!err) {
      error.message = error.errortext;
    } else {
      error.message = err.translation;

      const matches = err.regex.exec(error.errortext);
      matches.shift();
      error.params = matches.reduce((map, val, index) => {
        map[`val${index + 1}`] = val;
        return map;
      }, {});
    }

    return error;
  }
}
