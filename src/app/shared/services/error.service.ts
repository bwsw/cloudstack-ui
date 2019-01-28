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
    {
      regex: /The token does not exist/,
      translation: 'ERRORS.VM_LOGS.TOKEN_DOES_NOT_EXIST',
    },
    {
      regex: /Invalid token/,
      translation: 'ERRORS.VM_LOGS.INVALID_TOKEN',
    },
    {
      regex: /Can not snapshot memory when VM is not in Running state/,
      translation: 'ERRORS.SNAPSHOT.CREATION_UNAVAILABLE_FOR_STOPPED',
    },
    {
      regex: /Creating vm snapshot failed due to VM:(.*) is not in the running or Stopped state/,
      translation: 'ERRORS.SNAPSHOT.CREATION_UNAVAILABLE_FOR_STOPPED',
    },
    {
      regex: /Internal error executing command, please contact your system administrator/,
      translation: 'ERRORS.SNAPSHOT.CREATION_UNAVAILABLE',
    },
    {
      regex: /VM Snapshot revert not allowed. This will result in VM state change. You can revert running VM to disk and memory type snapshot and stopped VM to disk type snapshot/,
      translation: 'ERRORS.SNAPSHOT.REVERT_UNAVAILABLE_FOR_STOPPED',
    },
    {
      regex: /Failed to retrieve resource limits/,
      translation: 'ERRORS.RESOURCE_QUOTAS.FAILED_RETRIEVE',
    },
    {
      regex: /Failed to retrieve user account/,
      translation: 'ERRORS.RESOURCE_QUOTAS.FAILED_RETRIEVE',
    },
    {
      regex: /Failed to retrieve accounts/,
      translation: 'ERRORS.RESOURCE_QUOTAS.FAILED_RETRIEVE',
    },
    {
      regex: /Failed to retrieve domains/,
      translation: 'ERRORS.RESOURCE_QUOTAS.FAILED_RETRIEVE',
    },
    {
      regex: /maximum must be greater than or equal to minimum/,
      translation: 'ERRORS.RESOURCE_QUOTAS.MAX_MUST_BE_GREATER',
    },
    {
      regex: /max must be between (\d+) and (\d+)/,
      translation: 'ERRORS.RESOURCE_QUOTAS.MAX_MUST_BE_BETWEEN',
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
